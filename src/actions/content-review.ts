"use server";

import { requireAdmin } from "@/lib/auth-utils";
import { prisma } from "@/lib/prisma";
import { revalidatePath, updateTag } from "next/cache";
import { ContentWorkflowError, assertVersion, transition } from "@/lib/content-workflow";
import type { ContentKind, ReviewOperation } from "@/lib/content-workflow";

export async function reviewContent(
  kind: ContentKind, id: string, version: number,
  operation: ReviewOperation, note?: string,
) {
  try {
    const session = await requireAdmin();
    if (!session) throw new ContentWorkflowError("Unauthorized.");
    if (!["news", "event", "publication"].includes(kind)) {
      throw new ContentWorkflowError("Jenis konten tidak valid.");
    }
    await prisma.$transaction(async (tx) => {
      const current = kind === "news"
        ? await tx.news.findUnique({ where: { id } })
        : kind === "event"
          ? await tx.event.findUnique({ where: { id } })
          : await tx.publication.findUnique({ where: { id } });
      if (!current) throw new ContentWorkflowError("Konten tidak ditemukan.");
      assertVersion(current, version);
      const reviewStatus = transition(session.user, current, operation, note);
      const scheduledAt = "publishedAt" in current ? current.publishedAt : null;
      const approved = reviewStatus === "APPROVED";
      const data = {
        reviewStatus,
        contentVersion: { increment: 1 },
        reviewerId: operation === "submit" ? null : session.user.id,
        reviewedAt: operation === "submit" ? null : new Date(),
        reviewNote: operation === "revision" ? note!.trim() : null,
      };
      const where = { id, contentVersion: version, reviewStatus: current.reviewStatus };
      const status = approved ? "PUBLISHED" as const
        : operation === "archive" ? "ARCHIVED" as const : "DRAFT" as const;
      const result = kind === "news"
        ? await tx.news.updateMany({ where, data: {
          ...data, status,
          publishedAt: approved ? scheduledAt ?? new Date() : null,
        } })
        : kind === "event"
          ? await tx.event.updateMany({ where, data: { ...data, status } })
          : await tx.publication.updateMany({ where, data: {
            ...data, status,
            // Approval retains the author's schedule; direct publish may set now.
            ...(approved && { publishedAt: scheduledAt ?? new Date() }),
          } });
      if (result.count !== 1) throw new ContentWorkflowError("Konten telah berubah. Muat ulang.");
    });
    updateTag(kind === "publication" ? "publications" : kind === "event" ? "events" : "news");
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    return { success: false, error: error instanceof ContentWorkflowError ? error.message : "Operasi gagal." };
  }
}
