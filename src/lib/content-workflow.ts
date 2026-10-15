export class ContentWorkflowError extends Error {}

export type ContentKind = "news" | "event" | "publication";
export type ReviewOperation = "submit" | "approve" | "revision" | "publish" | "unpublish" | "archive";
export type ContentActor = { id: string; role: string };
export type ContentState = {
  authorId: string | null;
  reviewStatus: "DRAFT" | "PENDING_REVIEW" | "REVISION_REQUIRED" | "APPROVED";
  contentVersion: number;
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: Date | null;
};

export function assertVersion(state: ContentState, version: unknown) {
  if (!Number.isSafeInteger(version) || version !== state.contentVersion) {
    throw new ContentWorkflowError("Konten telah berubah. Muat ulang sebelum melanjutkan.");
  }
}

export function assertEditable(actor: ContentActor, state: ContentState) {
  if (actor.role === "SUPER_ADMIN") return;
  if (
    actor.role !== "ADMIN" || state.authorId !== actor.id ||
    state.status === "PUBLISHED" || state.status === "ARCHIVED" ||
    !["DRAFT", "REVISION_REQUIRED"].includes(state.reviewStatus)
  ) {
    throw new ContentWorkflowError("Anda tidak berhak mengubah konten ini.");
  }
}

export function publicationReview(actor: ContentActor, status: string) {
  if (actor.role !== "ADMIN" && actor.role !== "SUPER_ADMIN") {
    throw new ContentWorkflowError("Role tidak valid.");
  }
  if (!["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    throw new ContentWorkflowError("Status tidak valid.");
  }
  if (actor.role !== "SUPER_ADMIN" && status !== "DRAFT") {
    throw new ContentWorkflowError("Hanya Super Admin yang dapat menerbitkan atau mengarsipkan.");
  }
  return status === "PUBLISHED" ? "APPROVED" as const : "DRAFT" as const;
}

export function transition(
  actor: ContentActor, state: ContentState, operation: ReviewOperation,
  note?: string,
) {
  if (operation === "submit") {
    assertEditable(actor, state);
    if (!["DRAFT", "REVISION_REQUIRED"].includes(state.reviewStatus) ||
        state.status === "ARCHIVED" || state.status === "PUBLISHED") {
      throw new ContentWorkflowError("Konten ini tidak dapat diajukan.");
    }
    return "PENDING_REVIEW" as const;
  }
  if (actor.role !== "SUPER_ADMIN") throw new ContentWorkflowError("Akses Super Admin diperlukan.");
  if (operation === "approve" || operation === "revision") {
    if (state.reviewStatus !== "PENDING_REVIEW") {
      throw new ContentWorkflowError("Pengajuan tidak lagi menunggu review.");
    }
    if (operation === "revision" && (!note?.trim() || note.length > 5000)) {
      throw new ContentWorkflowError("Alasan revisi wajib diisi, maksimal 5000 karakter.");
    }
    return operation === "approve" ? "APPROVED" as const : "REVISION_REQUIRED" as const;
  }
  if (operation === "publish") return "APPROVED" as const;
  if (operation === "unpublish" || operation === "archive") return "DRAFT" as const;
  throw new ContentWorkflowError("Operasi tidak valid.");
}
