import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "./prisma";
import { requireAdmin, requireSuperAdmin } from "./auth-utils";
import { mutateWithMedia } from "./media-lifecycle";
import { revalidatePath, updateTag } from "next/cache";
import { ContentWorkflowError, assertEditable, assertVersion, transition, type ContentKind, type ContentVersion } from "./content-workflow";
import { isContentKind, normalizeContent } from "./content-fields";
import { applyContent, readContent, type ContentSnapshot, snapshot } from "./content-records";

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
    // Apply ownership in SQL; a central record always overrides legacy authorship.
    const legacyTable = kind === "news" ? Prisma.raw('"News"') : kind === "event" ? Prisma.raw('"Event"') : null;
    const legacy = legacyTable ? Prisma.sql`
      UNION
      SELECT legacy.id FROM ${legacyTable} legacy
      WHERE legacy."authorId" = ${actor.id}
        AND NOT EXISTS (SELECT 1 FROM "ContentChange" registered
          WHERE registered.kind = ${kind}::"ContentModule" AND registered."targetId" = legacy.id)
    ` : Prisma.empty;
    const ownership = await prisma.$queryRaw<Array<{ id: string }>>(Prisma.sql`
      SELECT "targetId" AS id FROM "ContentChange"
      WHERE kind = ${kind}::"ContentModule" AND "authorId" = ${actor.id}
      ${legacy}
    `);
    const ids = ownership.map(item => item.id);
    return { id: { in: ids } };
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && ["P2021", "P2022"].includes(String(error.code))) return { id: { in: [] } };
    // Raw SQL reports missing relations/columns as P2010 rather than ORM P2021/P2022.
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2010") {
      console.error("[content-approval] Ownership lookup failed; access denied:", error);
      return { id: { in: [] } };
    }
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

// Capture proposal versions before reading the page's canonical rows. Concurrent
// changes between these reads cause a conservative conflict, never a fresh token for stale data.
export async function contentVersions(kinds: ContentKind[]) {
  try {
    const rows = await prisma.contentChange.findMany({ where: { kind: { in: kinds } }, select: { kind: true, targetId: true, contentVersion: true } });
    return Object.fromEntries(rows.map(row => [`${row.kind}:${row.targetId}`, row.contentVersion]));
  } catch (error) {
    if (typeof error === "object" && error && "code" in error && ["P2021", "P2022"].includes(String(error.code))) return {};
    throw error;
  }
}

export function contentVersion(kind: ContentKind, record: object, versions: Record<string, number>): ContentVersion {
  const value = record as Record<string, unknown>;
  return { canonical: canonicalVersion(kind, value), proposal: versions[`${kind}:${value.id}`] ?? null };
}

function canonicalVersion(kind: ContentKind, value: Record<string, unknown>) {
  const fields = kind === "news" ? ["contentVersion"]
    : kind === "managementPeriod" ? ["period", "isActive", "positions"]
    : kind === "managementPosition" ? ["periodId", "memberProfileId", "title", "department", "order"]
    : ["updatedAt"];
  if (fields.some(key => value[key] === undefined)) throw new ContentWorkflowError("Versi konten tidak tersedia. Muat ulang.");
  const selected = Object.fromEntries(fields.map(key => [key, value[key]]));
  // Period deletion cascades to positions: include their scalar state, independent
  // of UI ordering or joined member data, so stale pages cannot delete changed positions.
  if (kind === "managementPeriod") {
    selected.positions = (value.positions as Record<string, unknown>[]).map(position =>
      Object.fromEntries(["id", "periodId", "memberProfileId", "title", "department", "order", "createdAt"].map(key => [key, position[key]]))
    ).sort((a, b) => String(a.id).localeCompare(String(b.id)));
  }
  return hash(snapshot(selected))!;
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
  input: unknown = {}, patch = false, expectedVersion?: ContentVersion): Promise<ContentResult> {
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
      const previous = await tx.contentChange.findUnique({ where: { kind_targetId: { kind, targetId: id } } });
      if (operation !== "CREATE" && (!expectedVersion || !current ||
        expectedVersion.canonical !== canonicalVersion(kind, current) ||
        expectedVersion.proposal !== (previous?.contentVersion ?? null))) {
        throw new ContentWorkflowError("Konten atau pengajuan telah berubah. Muat ulang sebelum melanjutkan.");
      }
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
      const request = previous
        ? await tx.contentChange.update({ where: { id: previous.id, contentVersion: previous.contentVersion },
          data: { ...metadata, contentVersion: { increment: 1 } }, select: { id: true } })
        : await tx.contentChange.create({ data: { ...metadata, kind, targetId: id, authorId: ownerId ?? actor.id }, select: { id: true } });
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
      if (hash(current) !== request.baseHash) throw new ContentWorkflowError("Versi publik telah berubah. Muat ulang dan buat pengajuan berdasarkan konten terbaru.");
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
