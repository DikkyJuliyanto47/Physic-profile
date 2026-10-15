"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useContentPermissions } from "./use-content-permissions";
import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { reviewContent } from "@/actions/content-review";
import type { ContentKind, ContentState, ReviewOperation } from "@/lib/content-workflow";

export function ContentReviewControls({ kind, id, state, disabled = false, onBusyChange }: {
  kind: ContentKind;
  id: string;
  state: ContentState & { reviewNote?: string | null };
  disabled?: boolean;
  onBusyChange?: (busy: boolean) => void;
}) {
  const router = useRouter();
  const noteId = useId();
  const inFlight = useRef(false);
  const permissions = useContentPermissions(state);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(operation: ReviewOperation) {
    if (inFlight.current || disabled) return;
    if (operation === "revision" && !note.trim()) {
      setError("Isi alasan revisi sebelum melanjutkan.");
      return;
    }
    inFlight.current = true;
    onBusyChange?.(true);
    setBusy(true);
    setError("");
    let navigating = false;
    try {
      const result = await reviewContent(kind, id, state.contentVersion, operation, note);
      if (!result.success) setError(result.error ?? "Operasi gagal.");
      else {
        const path = kind === "event" ? "events" : kind === "publication" ? "publication" : "news";
        navigating = true;
        router.push(`/admin/${path}?result=${operation}`);
        router.refresh();
      }
    } catch {
      setError("Operasi gagal. Muat ulang sebelum mencoba kembali.");
    } finally {
      if (!navigating) {
        inFlight.current = false;
        setBusy(false);
        onBusyChange?.(false);
      }
    }
  }
  const operations: { operation: ReviewOperation; label: string }[] = [];
  if (permissions.canSubmit) {
    operations.push({ operation: "submit", label: "Ajukan Review" });
  }
  if (permissions.canReview) {
    operations.push({ operation: "approve", label: "Setujui" });
    operations.push({ operation: "revision", label: "Minta Revisi" });
  }
  if (permissions.superAdmin) {
    if (state.status !== "PUBLISHED") operations.push({ operation: "publish", label: "Terbitkan langsung" });
    if (state.status === "PUBLISHED") operations.push({ operation: "unpublish", label: "Batalkan publikasi" });
    if (state.status !== "ARCHIVED") operations.push({ operation: "archive", label: "Arsipkan" });
  }
  return <div data-review-controls className="space-y-3 rounded-md border border-neutral-200 p-4">
    <ReviewStatusBadge status={state.reviewStatus} />
    <p className="text-sm text-neutral-500">
      Aksi review berlaku pada versi tersimpan. Simpan perubahan form terlebih dahulu.
    </p>
    {state.reviewNote && <div className="rounded-md border border-amber-200 bg-amber-50 p-3">
      <p className="text-sm font-semibold text-amber-900">Catatan reviewer</p>
      <p className="whitespace-pre-wrap break-words text-sm text-amber-800">{state.reviewNote}</p>
    </div>}
    {permissions.canReview && <div>
      <label htmlFor={noteId} className="mb-1.5 block text-sm font-medium text-neutral-700">Alasan revisi</label>
      <textarea id={noteId} disabled={busy || disabled}
      aria-label="Alasan revisi" value={note}
      onChange={(event) => setNote(event.target.value)} maxLength={5000}
      className="w-full rounded border p-2" placeholder="Alasan revisi"
    /></div>}
    <div className="flex flex-wrap gap-2">{operations.map(({ operation, label }) =>
      <button key={operation} type="button" disabled={busy || disabled || permissions.loading}
        onClick={() => run(operation)} className="rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50">
        {busy ? "Memproses..." : label}
      </button>)}</div>
    {disabled && <p className="text-sm text-neutral-500">Simpan perubahan sebelum melakukan review.</p>}
    {busy && <p role="status" className="text-sm text-neutral-500">Memproses tindakan...</p>}
    {error && <p role="alert" className="text-red-600">{error}</p>}
  </div>;
}
