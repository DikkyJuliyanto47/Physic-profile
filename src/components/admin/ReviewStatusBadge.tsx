import type { ContentState } from "@/lib/content-workflow";

export const REVIEW_LABELS = {
  DRAFT: "Draf", PENDING_REVIEW: "Menunggu review",
  REVISION_REQUIRED: "Ditolak / perlu revisi", APPROVED: "Disetujui",
} as const;
const tones = {
  DRAFT: "bg-neutral-100 text-neutral-600", PENDING_REVIEW: "bg-amber-50 text-amber-700",
  REVISION_REQUIRED: "bg-red-50 text-red-700", APPROVED: "bg-emerald-50 text-emerald-700",
};
export function ReviewStatusBadge({ status }: { status: ContentState["reviewStatus"] }) {
  return <span className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ${tones[status]}`}>{REVIEW_LABELS[status]}</span>;
}

export function ReviewFilter({ value }: { value?: string }) {
  return <select name="review" defaultValue={value ?? ""} aria-label="Status pengajuan"
    className="h-10 rounded-md border border-neutral-200 bg-white px-3.5 text-sm text-neutral-700">
    <option value="">Semua pengajuan</option>
    {Object.entries(REVIEW_LABELS).filter(([status]) => status !== "DRAFT").map(([status, label]) => <option key={status} value={status}>{label}</option>)}
  </select>;
}
