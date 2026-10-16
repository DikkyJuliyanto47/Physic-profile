"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { reviewContent } from "@/actions/content-review";
import { contentPermissions } from "@/lib/content-permissions";
import { transition, type ContentActor, type ContentState, type ReviewOperation } from "@/lib/content-workflow";

export function ContentReviewControls({ id, actor, state, disabled = false, onBusyChange }: {
  id: string; actor: ContentActor;
  state: ContentState & { reviewNote?: string | null };
  disabled?: boolean; onBusyChange?: (busy: boolean) => void;
}) {
  const router = useRouter();
  const noteId = useId();
  const inFlight = useRef(false);
  const permissions = contentPermissions(actor, state);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(operation: ReviewOperation) {
    if (inFlight.current || disabled) return;
    if (operation === "revision" && !note.trim()) { setError("Isi alasan penolakan terlebih dahulu."); return; }
    inFlight.current = true;
    onBusyChange?.(true);
    setBusy(true);
    setError("");
    try {
      const result = await reviewContent("news", id, state.contentVersion, operation, note);
      if (!result.success) setError(result.error ?? "Operasi gagal.");
      else { router.push(`/admin/news?result=${operation}`); router.refresh(); }
    } catch { setError("Operasi gagal. Muat ulang sebelum mencoba kembali."); }
    finally { inFlight.current = false; setBusy(false); onBusyChange?.(false); }
  }
  const candidates: { operation: ReviewOperation; label: string }[] = [
    { operation: "approve", label: "Setujui dan terbitkan" },
    { operation: "revision", label: "Tolak / minta revisi" },
    { operation: "publish", label: "Terbitkan langsung" },
    { operation: "unpublish", label: "Batalkan publikasi" },
    { operation: "archive", label: "Arsipkan" },
  ];
  const operations = candidates.filter(({ operation }) => {
    if (operation === "publish" && state.status === "PUBLISHED" || operation === "archive" && state.status === "ARCHIVED") return false;
    try { transition(actor, state, operation, "preview"); return true; } catch { return false; }
  });
  return <div className="space-y-3 rounded-md border border-neutral-200 p-4">
    <ReviewStatusBadge status={state.reviewStatus} />
    {state.status === "PUBLISHED" && state.reviewStatus !== "APPROVED" && <p className="text-sm text-neutral-500">Versi publik tetap ditampilkan sampai revisi disetujui.</p>}
    {state.reviewNote && <p className="whitespace-pre-wrap break-words rounded-md bg-amber-50 p-3 text-sm text-amber-800">Catatan reviewer: {state.reviewNote}</p>}
    {permissions.canReview && <div>
      <label htmlFor={noteId} className="mb-1.5 block text-sm font-medium text-neutral-700">Alasan penolakan / revisi</label>
      <textarea id={noteId} disabled={busy || disabled} value={note} onChange={(event) => setNote(event.target.value)} maxLength={5000}
        className="w-full rounded-md border border-neutral-200 p-3 text-sm" />
    </div>}
    <div className="flex flex-wrap gap-2">{operations.map(({ operation, label }) =>
      <button key={operation} type="button" disabled={busy || disabled} onClick={() => run(operation)}
        className="rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50">{busy ? "Memproses..." : label}</button>)}</div>
    {disabled && <p className="text-sm text-neutral-500">Simpan perubahan form sebelum melakukan review.</p>}
    {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
  </div>;
}
