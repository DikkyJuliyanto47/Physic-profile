"use server";

import { requireSuperAdmin } from "@/lib/auth-utils";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { Prisma } from "@/generated/prisma/client";
import { revalidatePath, updateTag } from "next/cache";
import { ContentWorkflowError, assertVersion, parseNewsRevision, transition } from "@/lib/content-workflow";
import type { ContentKind, ReviewOperation } from "@/lib/content-workflow";
import { requireNewsApproval, verifyNewsActor, newsActionError } from "@/lib/news-approval";
import { parseNewsEventDate } from "@/lib/news-event-date";
import type { ActionResponse } from "@/actions/news";

export async function reviewContent(kind: ContentKind, id: string, version: number, operation: ReviewOperation, note?: string): Promise<ActionResponse> {
  try {
    const session = await requireSuperAdmin();
    if (!session) throw new ContentWorkflowError("Akses Super Admin diperlukan.");
    if (kind !== "news") throw new ContentWorkflowError("Review hanya tersedia untuk Berita.");
    await requireNewsApproval();
    const slug = await mutateWithMedia(null, async (tx) => {
      const actor = await verifyNewsActor(tx, session.user);
      const current = await tx.news.findUnique({ where: { id } });
      if (!current) throw new ContentWorkflowError("Berita tidak ditemukan.");
      assertVersion(current, version);
      const reviewStatus = transition(actor, current, operation, note);
      const approving = operation === "approve";
      // Parse only the persisted snapshot, never content supplied by the reviewer client.
      if (approving && !current.pendingRevision) throw new ContentWorkflowError("Snapshot pengajuan tidak tersedia.");
      const revision = approving ? parseNewsRevision(current.pendingRevision) : null;
      const result = await tx.news.updateMany({ where: { id, contentVersion: version, reviewStatus: current.reviewStatus }, data: {
        ...(revision && { ...revision, eventDate: revision.eventDate ? parseNewsEventDate(revision.eventDate) : null,
          pendingRevision: Prisma.DbNull }),
        ...(approving || operation === "publish" ? { status: "PUBLISHED", publishedAt: current.publishedAt ?? new Date() } : {}),
        ...(operation === "unpublish" ? { status: "DRAFT", publishedAt: null } : {}),
        ...(operation === "archive" ? { status: "ARCHIVED", publishedAt: null } : {}),
        reviewStatus, contentVersion: { increment: 1 },
        ...(operation === "revision" ? { updatedAt: current.updatedAt } : {}),
        ...(operation === "approve" || operation === "revision" || operation === "publish" ? {
          reviewerId: actor.id, reviewedAt: new Date(), reviewNote: operation === "revision" ? note!.trim() : null,
        } : {}),
      } });
      if (result.count !== 1) throw new ContentWorkflowError("Konten berubah. Muat ulang.");
      return current.slug;
    }, (tx) => tx.news.findUnique({ where: { id } }), { isolationLevel: "Serializable" });
    updateTag("news");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/news");
    revalidatePath(`/news/${slug}`);
    revalidatePath("/admin/news");
    revalidatePath(`/admin/news/${id}/edit`);
    return { success: true };
  } catch (error) { return newsActionError(error); }
}
