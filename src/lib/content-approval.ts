import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { requireAdmin, requireSuperAdmin } from "./auth-utils";
import { mutateWithMedia } from "./media-lifecycle";
import { revalidatePath, updateTag } from "next/cache";
import { ContentWorkflowError, assertEditable, assertVersion, transition, type ContentKind } from "./content-workflow";
import { isContentKind, normalizeContent } from "./content-fields";
import { applyContent, readContent, type ContentSnapshot } from "./content-records";

export type ContentResult = { success: boolean; error?: string; pending?: boolean; requestId?: string };
export const CONTENT_APPROVAL_UNAVAILABLE = "Persetujuan konten belum diaktifkan. Hubungi pengelola sistem.";

export async function isContentApprovalReady() {
  try {
    await prisma.contentChange.findFirst();
    // Old News-only proposals must first be migrated to the central queue.
    const legacy = await prisma.news.findFirst({ where: { pendingRevision: { not: Prisma.AnyNull } }, select: { id: true } });
    return !legacy;
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && ["P2021", "P2022"].includes(String(error.code))) return false;
    throw error;
  }
}

export async function requireApprovalReady() {
  if (!await isContentApprovalReady()) throw new ContentWorkflowError(CONTENT_APPROVAL_UNAVAILABLE);
}

export async function ownedContentWhere(kind: ContentKind, actor: { id: string; role: string }): Promise<{ id?: { in: string[] } }> {
  if (actor.role === "SUPER_ADMIN") return {};
  if (actor.role !== "ADMIN") return { id: { in: [] } };
  try {
    const ownership = await prisma.contentChange.findMany({ where: { kind }, select: { targetId: true, authorId: true } });
    const registered = new Set(ownership.map((item) => item.targetId));
    const ids = ownership.filter((item) => item.authorId === actor.id).map((item) => item.targetId);
    // Historical News/Event already carry trustworthy authorship. Other legacy
    // content needs explicit ownership reconciliation; never guess a university.
    const legacy = kind === "news" ? await prisma.news.findMany({ where: { authorId: actor.id }, select: { id: true } })
      : kind === "event" ? await prisma.event.findMany({ where: { authorId: actor.id }, select: { id: true } }) : [];
    ids.push(...legacy.filter((item) => !registered.has(item.id)).map((item) => item.id));
    return { id: { in: ids } };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && ["P2021", "P2022"].includes(String(error.code))) return { id: { in: [] } };
    throw error;
  }
}

export async function canManageContent(kind: ContentKind, id: string, actor: { id: string; role: string }) {
  if (actor.role === "SUPER_ADMIN") return true;
  const scope = await ownedContentWhere(kind, actor);
  return scope.id?.in.includes(id) ?? false;
}

export async function verifyContentActor(tx: Prisma.TransactionClient, user: { id: string; sessionVersion?: number }) {
  const account = await tx.user.findUnique({ where: { id: user.id }, select: { id: true, role: true, isActive: true, sessionVersion: true } });
  if (!account?.isActive || account.sessionVersion !== user.sessionVersion || !["ADMIN", "SUPER_ADMIN"].includes(account.role)) {
    throw new ContentWorkflowError("Sesi tidak valid. Silakan login kembali.");
  }
  return account;
}

function hash(value: ContentSnapshot | null) {
  const stable = (item: unknown): unknown => Array.isArray(item) ? item.map(stable) : item && typeof item === "object"
    ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)).map(([key, field]) => [key, stable(field)])) : item;
  return value ? createHash("sha256").update(JSON.stringify(stable(value))).digest("hex") : null;
}

export function contentError(error: unknown): ContentResult {
  if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
  const code = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
  if (code === "P2021" || code === "P2022") return { success: false, error: CONTENT_APPROVAL_UNAVAILABLE };
  if (code === "P2002") return { success: false, error: "Nama, email, atau alamat konten sudah digunakan. Perbarui pengajuan." };
  if (code === "P2003" || code === "P2025") return { success: false, error: "Data terkait tidak tersedia atau masih digunakan. Perbarui pengajuan." };
  if (code === "P2034") return { success: false, error: "Data berubah bersamaan. Muat ulang sebelum mencoba lagi." };
  console.error("[content-approval] Operation failed:", error);
  return { success: false, error: "Gagal memproses konten. Silakan coba lagi." };
}

export function revalidateContent() {
  for (const tag of ["news", "events", "members", "managements", "universities", "publications", "gallery"]) updateTag(tag);
  revalidatePath("/", "layout");
}

// All existing module actions delegate here. No unapproved canonical rows exist.
export async function submitContent(kind: ContentKind, operation: "CREATE" | "UPDATE" | "DELETE", targetId: string | null,
  input: unknown = {}, patch = false, newsVersion?: number): Promise<ContentResult> {
  try {
    const session = await requireAdmin();
    if (!session) throw new ContentWorkflowError("Unauthorized. Silakan login.");
    if (!isContentKind(kind) || !["CREATE", "UPDATE", "DELETE"].includes(operation)) throw new ContentWorkflowError("Jenis pengajuan tidak valid.");
    if (operation !== "CREATE" && (typeof targetId !== "string" || !targetId.trim() || targetId.length > 200)) throw new ContentWorkflowError("ID konten tidak valid.");
    await requireApprovalReady();
    const id = operation === "CREATE" ? randomUUID() : targetId!;
    const result = await mutateWithMedia(input, async (tx) => {
      const actor = await verifyContentActor(tx, session.user);
      const current = operation === "CREATE" ? null : await readContent(tx, kind, id);
      if (operation !== "CREATE" && !current) throw new ContentWorkflowError("Konten tidak ditemukan.");
      if (kind === "news" && current && newsVersion !== undefined && newsVersion !== current.contentVersion) {
        throw new ContentWorkflowError("Konten telah berubah. Muat ulang sebelum melanjutkan.");
      }
      const previous = await tx.contentChange.findUnique({ where: { kind_targetId: { kind, targetId: id } } });
      const ownerId = previous?.authorId ?? (typeof current?.authorId === "string" ? current.authorId : operation === "CREATE" ? actor.id : null);
      if (actor.role !== "SUPER_ADMIN" && ownerId !== actor.id) throw new ContentWorkflowError("Anda tidak memiliki hak pengelolaan konten ini.");
      const payload = operation === "DELETE" ? {} : normalizeContent(kind, input, current ?? {});
      if (kind === "publication" && current?.publishedAt && payload.publishedAt &&
        typeof input === "object" && input !== null && "publishedAt" in input && typeof input.publishedAt === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(input.publishedAt) &&
        input.publishedAt === new Date(new Date(String(current.publishedAt)).getTime() + 7 * 3600000).toISOString().slice(0, 10)) {
        payload.publishedAt = String(current.publishedAt);
      }
      // Toggles are patches resolved from the canonical record inside the transaction.
      if (patch && kind === "event" && current) payload.status = current.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      if (patch && kind === "news" && current) payload.status = current.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      if (actor.role === "ADMIN" && operation !== "DELETE") {
        // New submissions are publication proposals. Existing status changes,
        // including unpublishing, are preserved for explicit review.
        if (operation === "CREATE" && (kind === "news" || kind === "event")) payload.status = "PUBLISHED";
        if (operation === "CREATE" && kind === "publication" && !payload.publishedAt) payload.publishedAt = new Date().toISOString();
      }
      const direct = actor.role === "SUPER_ADMIN";
      if (direct) await applyContent(tx, kind, operation, id, payload, ownerId ?? actor.id, actor.id, current);
      const metadata = {
        operation, payload: direct ? Prisma.DbNull : payload, before: direct ? Prisma.DbNull : current ?? Prisma.DbNull,
        baseHash: hash(current), submittedById: actor.id,
        reviewStatus: direct ? "APPROVED" as const : "PENDING_REVIEW" as const,
        reviewerId: direct ? actor.id : null, reviewedAt: direct ? new Date() : null, reviewNote: null,
      };
      const request = await tx.contentChange.upsert({ where: { kind_targetId: { kind, targetId: id } },
        create: { ...metadata, kind, targetId: id, authorId: ownerId ?? actor.id },
        update: { ...metadata, contentVersion: { increment: 1 } }, select: { id: true } });
      return { success: true, pending: !direct, requestId: request.id };
    }, (tx) => operation === "CREATE" ? Promise.resolve(null) : Promise.all([
      readContent(tx, kind, id), tx.contentChange.findUnique({ where: { kind_targetId: { kind, targetId: id } } }),
    ]), { isolationLevel: "Serializable" });
    revalidateContent();
    return result;
  } catch (error) { return contentError(error); }
}

export async function decideContent(id: string, version: number, operation: "approve" | "revision", note?: string): Promise<ContentResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session) throw new ContentWorkflowError("Akses Super Admin diperlukan.");
    if (operation !== "approve" && operation !== "revision") throw new ContentWorkflowError("Operasi review tidak valid.");
    await requireApprovalReady();
    const proposed = operation === "approve" ? await prisma.contentChange.findUnique({ where: { id }, select: { payload: true, contentVersion: true } }) : null;
    if (proposed && proposed.contentVersion !== version) throw new ContentWorkflowError("Pengajuan telah berubah. Muat ulang.");
    await mutateWithMedia(proposed?.payload, async (tx) => {
      const actor = await verifyContentActor(tx, session.user);
      const request = await tx.contentChange.findUnique({ where: { id } });
      if (!request) throw new ContentWorkflowError("Pengajuan tidak ditemukan.");
      assertVersion(request, version);
      const reviewStatus = transition(actor, request, operation, note);
      if (operation === "approve") {
        const current = await readContent(tx, request.kind, request.targetId);
        if (hash(current) !== request.baseHash || request.operation !== "CREATE" && !current) {
          throw new ContentWorkflowError("Versi publik telah berubah. Tolak dan minta pengajuan ulang agar perubahan terbaru ikut ditinjau.");
        }
        const payload = request.operation === "DELETE" ? {} : normalizeContent(request.kind, request.payload);
        await applyContent(tx, request.kind, request.operation, request.targetId, payload, request.authorId, actor.id, current);
      }
      const updated = await tx.contentChange.updateMany({ where: { id, contentVersion: version, reviewStatus: "PENDING_REVIEW" }, data: {
        reviewStatus, reviewerId: actor.id, reviewedAt: new Date(), reviewNote: operation === "revision" ? note!.trim() : null,
        ...(operation === "approve" ? { payload: Prisma.DbNull, before: Prisma.DbNull } : {}), contentVersion: { increment: 1 },
      } });
      if (updated.count !== 1) throw new ContentWorkflowError("Pengajuan telah berubah. Muat ulang.");
    }, (tx) => tx.contentChange.findUnique({ where: { id } }), { isolationLevel: "Serializable" });
    revalidateContent();
    return { success: true };
  } catch (error) { return contentError(error); }
}

export async function reviseContent(id: string, version: number, input: unknown): Promise<ContentResult> {
  try {
    const session = await requireAdmin();
    if (!session) throw new ContentWorkflowError("Unauthorized. Silakan login.");
    await requireApprovalReady();
    await mutateWithMedia(input, async (tx) => {
      const actor = await verifyContentActor(tx, session.user);
      const request = await tx.contentChange.findUnique({ where: { id } });
      if (!request) throw new ContentWorkflowError("Pengajuan tidak ditemukan.");
      assertEditable(actor, request);
      assertVersion(request, version);
      if (!["PENDING_REVIEW", "REVISION_REQUIRED"].includes(request.reviewStatus)) throw new ContentWorkflowError("Pengajuan sudah selesai.");
      const current = await readContent(tx, request.kind, request.targetId);
      if (request.operation !== "CREATE" && !current) throw new ContentWorkflowError("Konten sudah tidak tersedia.");
      const payload = request.operation === "DELETE" ? {} : normalizeContent(request.kind, input);
      if (actor.role === "ADMIN") {
        if (request.operation === "CREATE" && (request.kind === "news" || request.kind === "event")) payload.status = "PUBLISHED";
        if (request.operation === "CREATE" && request.kind === "publication" && !payload.publishedAt) payload.publishedAt = new Date().toISOString();
      }
      await tx.contentChange.update({ where: { id, contentVersion: version }, data: {
        payload, before: current ?? Prisma.DbNull, baseHash: hash(current), reviewStatus: "PENDING_REVIEW",
        submittedById: actor.id, reviewerId: null, reviewedAt: null, reviewNote: null, contentVersion: { increment: 1 },
      } });
    }, (tx) => tx.contentChange.findUnique({ where: { id } }), { isolationLevel: "Serializable" });
    revalidateContent();
    return { success: true, pending: true, requestId: id };
  } catch (error) { return contentError(error); }
}
