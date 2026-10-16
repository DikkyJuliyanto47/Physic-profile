import { NewsCategory } from "@/generated/prisma/enums";
import { parseNewsEventDate } from "./news-event-date";

// Adapted from 749315a. Only News is enabled in this phase.
export class ContentWorkflowError extends Error {}
export type ContentKind = "news";
export type ReviewOperation = "approve" | "revision" | "publish" | "unpublish" | "archive";
export type ContentActor = { id: string; role: string };
export type ContentState = {
  authorId: string;
  reviewStatus: "DRAFT" | "PENDING_REVIEW" | "REVISION_REQUIRED" | "APPROVED";
  contentVersion: number;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export function assertVersion(state: ContentState, version: unknown) {
  if (!Number.isSafeInteger(version) || version !== state.contentVersion) {
    throw new ContentWorkflowError("Konten telah berubah. Muat ulang sebelum melanjutkan.");
  }
}

export type NewsRevision = {
  title: string; category: NewsCategory; excerpt: string | null;
  content: string; imageUrl: string | null; eventDate: string | null;
};

export function parseNewsRevision(value: unknown): NewsRevision {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContentWorkflowError("Data berita tidak valid.");
  const data = value as Record<string, unknown>;
  if (typeof data.title !== "string" || !data.title.trim() || data.title.trim().length > 200 ||
    typeof data.content !== "string" || !data.content.trim() || data.content.length > 200000 ||
    !Object.values(NewsCategory).some((category) => category === data.category) ||
    [data.excerpt, data.imageUrl, data.eventDate].some((field) => field != null && typeof field !== "string")) {
    throw new ContentWorkflowError("Judul, kategori, atau konten berita tidak valid.");
  }
  const eventDate = typeof data.eventDate === "string" && data.eventDate ? data.eventDate : null;
  if (eventDate && !parseNewsEventDate(eventDate)) {
    throw new ContentWorkflowError("Tanggal kegiatan tidak valid.");
  }
  if (typeof data.excerpt === "string" && data.excerpt.length > 1000 ||
    typeof data.imageUrl === "string" && data.imageUrl.length > 2048) {
    throw new ContentWorkflowError("Ringkasan atau URL gambar terlalu panjang.");
  }
  return { title: data.title.trim(), category: data.category as NewsCategory, content: data.content.trim(),
    excerpt: typeof data.excerpt === "string" ? data.excerpt.trim() || null : null,
    imageUrl: typeof data.imageUrl === "string" ? data.imageUrl.trim() || null : null, eventDate };
}

export function assertEditable(actor: ContentActor, state: ContentState) {
  if (actor.role === "SUPER_ADMIN") return;
  if (actor.role !== "ADMIN" || state.authorId !== actor.id || state.status === "ARCHIVED") {
    throw new ContentWorkflowError("Anda tidak berhak mengubah berita ini.");
  }
}

export function transition(actor: ContentActor, state: ContentState, operation: ReviewOperation, note?: string) {
  if (actor.role !== "SUPER_ADMIN") throw new ContentWorkflowError("Akses Super Admin diperlukan.");
  if (operation === "approve" || operation === "revision") {
    if (state.reviewStatus !== "PENDING_REVIEW" || state.status === "ARCHIVED") {
      throw new ContentWorkflowError("Berita tidak lagi menunggu review.");
    }
    if (operation === "revision" && (typeof note !== "string" || !note.trim() || note.length > 5000)) {
      throw new ContentWorkflowError("Alasan penolakan wajib diisi, maksimal 5000 karakter.");
    }
    return operation === "approve" ? "APPROVED" as const : "REVISION_REQUIRED" as const;
  }
  if (operation === "publish") {
    if (state.reviewStatus === "PENDING_REVIEW" || state.reviewStatus === "REVISION_REQUIRED") {
      throw new ContentWorkflowError("Tinjau pengajuan atau simpan perubahan terlebih dahulu.");
    }
    return "APPROVED" as const;
  }
  if (operation === "unpublish" || operation === "archive") {
    if (state.reviewStatus === "PENDING_REVIEW") throw new ContentWorkflowError("Selesaikan review terlebih dahulu.");
    if (operation === "unpublish" && state.status !== "PUBLISHED") throw new ContentWorkflowError("Berita belum terbit.");
    return state.reviewStatus;
  }
  throw new ContentWorkflowError("Operasi tidak valid.");
}
