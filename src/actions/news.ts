"use server";

import { requireAdmin, requireSuperAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { Prisma, ContentStatus, type NewsCategory } from "@/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { parseNewsEventDate } from "@/lib/news-event-date";
import { ContentWorkflowError, assertEditable, assertVersion, parseNewsRevision, transition } from "@/lib/content-workflow";
import { contentPermissions } from "@/lib/content-permissions";
import { requireNewsApproval, verifyNewsActor, newsActionError } from "@/lib/news-approval";

export type NewsInput = {
  title: string;
  category: NewsCategory;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status: ContentStatus;
  eventDate?: string;
  contentVersion?: number;
};
export type ActionResponse = { success: boolean; error?: string };

function slugify(text: string) {
  return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

function validateInput(data: NewsInput) {
  const revision = parseNewsRevision(data);
  if (!Object.values(ContentStatus).some((status) => status === data.status)) {
    throw new ContentWorkflowError("Status berita tidak valid.");
  }
  return revision;
}

function revalidateNews(slug?: string) {
  updateTag("news");
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/news");
  revalidatePath("/admin/news");
  if (slug) revalidatePath(`/news/${slug}`);
}

export async function createNews(data: NewsInput): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) throw new ContentWorkflowError("Unauthorized. Silakan login.");
    await requireNewsApproval();
    const revision = validateInput(data);
    if (data.status === "ARCHIVED") throw new ContentWorkflowError("Berita baru tidak dapat langsung diarsipkan.");
    const slug = slugify(revision.title);
    if (!slug) throw new ContentWorkflowError("Judul berita harus mengandung huruf atau angka.");
    await mutateWithMedia(revision, async (tx) => {
      const actor = await verifyNewsActor(tx, session.user);
      const superAdmin = actor.role === "SUPER_ADMIN";
      await tx.news.create({ data: {
        ...revision, eventDate: revision.eventDate ? parseNewsEventDate(revision.eventDate) : null,
        slug, authorId: actor.id,
        status: superAdmin ? data.status : "DRAFT",
        publishedAt: superAdmin && data.status === "PUBLISHED" ? new Date() : null,
        reviewStatus: superAdmin ? data.status === "PUBLISHED" ? "APPROVED" : "DRAFT" : "PENDING_REVIEW",
        pendingRevision: superAdmin ? Prisma.DbNull : revision,
        reviewerId: superAdmin && data.status === "PUBLISHED" ? actor.id : null,
        reviewedAt: superAdmin && data.status === "PUBLISHED" ? new Date() : null,
      }, select: { id: true } });
    }, undefined, { isolationLevel: "Serializable" });
    revalidateNews(slug);
    return { success: true };
  } catch (error) { return newsActionError(error); }
}

export async function updateNews(id: string, data: NewsInput): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) throw new ContentWorkflowError("Unauthorized. Silakan login.");
    await requireNewsApproval();
    const revision = validateInput(data);
    const slug = await mutateWithMedia(revision, async (tx) => {
      const actor = await verifyNewsActor(tx, session.user);
      const current = await tx.news.findUnique({ where: { id } });
      if (!current) throw new ContentWorkflowError("Berita tidak ditemukan.");
      assertEditable(actor, current);
      assertVersion(current, data.contentVersion);
      const snapshot = { ...revision, eventDate: data.eventDate === undefined
        ? current.eventDate?.toISOString().slice(0, 10) ?? null : revision.eventDate };
      const superAdmin = actor.role === "SUPER_ADMIN";
      const result = await tx.news.updateMany({ where: { id, contentVersion: current.contentVersion }, data: {
        ...(superAdmin ? {
          ...snapshot, eventDate: snapshot.eventDate ? parseNewsEventDate(snapshot.eventDate) : null,
          status: data.status,
          publishedAt: data.status === "PUBLISHED" ? current.publishedAt ?? new Date() : null,
          pendingRevision: Prisma.DbNull,
          reviewStatus: data.status === "PUBLISHED" ? "APPROVED" : "DRAFT",
          reviewerId: data.status === "PUBLISHED" ? actor.id : null,
          reviewedAt: data.status === "PUBLISHED" ? new Date() : null,
        } : {
          pendingRevision: snapshot, reviewStatus: "PENDING_REVIEW", reviewerId: null, reviewedAt: null,
          updatedAt: current.updatedAt,
        }),
        reviewNote: null, contentVersion: { increment: 1 },
      } });
      if (result.count !== 1) throw new ContentWorkflowError("Konten berubah. Muat ulang.");
      return current.slug;
    }, (tx) => tx.news.findUnique({ where: { id } }), { isolationLevel: "Serializable" });
    revalidateNews(slug);
    revalidatePath(`/admin/news/${id}/edit`);
    return { success: true };
  } catch (error) { return newsActionError(error); }
}

export async function deleteNews(id: string, version?: number): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) throw new ContentWorkflowError("Unauthorized. Silakan login.");
    await requireNewsApproval();
    const slug = await mutateWithMedia(null, async (tx) => {
      const actor = await verifyNewsActor(tx, session.user);
      const current = await tx.news.findUnique({ where: { id } });
      if (!current) throw new ContentWorkflowError("Berita tidak ditemukan.");
      assertVersion(current, version);
      if (!contentPermissions(actor, current).canDelete) throw new ContentWorkflowError("Anda tidak berhak menghapus berita ini.");
      await tx.news.delete({ where: { id, contentVersion: current.contentVersion } });
      return current.slug;
    }, (tx) => tx.news.findUnique({ where: { id } }), { isolationLevel: "Serializable" });
    revalidateNews(slug);
    return { success: true };
  } catch (error) { return newsActionError(error); }
}

// Retained API; pending revisions must be reviewed on the edit page.
export async function toggleNewsStatus(id: string, version?: number): Promise<ActionResponse> {
  try {
    const session = await requireSuperAdmin();
    if (!session) throw new ContentWorkflowError("Akses Super Admin diperlukan.");
    await requireNewsApproval();
    const slug = await prisma.$transaction(async (tx) => {
      const actor = await verifyNewsActor(tx, session.user);
      if (actor.role !== "SUPER_ADMIN") throw new ContentWorkflowError("Akses Super Admin diperlukan.");
      const current = await tx.news.findUnique({ where: { id } });
      if (!current) throw new ContentWorkflowError("Berita tidak ditemukan.");
      assertVersion(current, version);
      if (current.pendingRevision || current.status === "ARCHIVED") throw new ContentWorkflowError("Gunakan halaman edit untuk meninjau berita ini.");
      const status = current.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
      const reviewStatus = transition(actor, current, status === "PUBLISHED" ? "publish" : "unpublish");
      await tx.news.update({ where: { id, contentVersion: current.contentVersion }, data: {
        status, publishedAt: status === "PUBLISHED" ? current.publishedAt ?? new Date() : null,
        reviewStatus,
        ...(status === "PUBLISHED" ? { reviewerId: actor.id, reviewedAt: new Date(), reviewNote: null } : {}),
        contentVersion: { increment: 1 },
      } });
      return current.slug;
    }, { isolationLevel: "Serializable" });
    revalidateNews(slug);
    return { success: true };
  } catch (error) { return newsActionError(error); }
}
