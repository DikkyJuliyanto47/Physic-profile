"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { reviewContent } from "@/actions/content-review";
import type { ContentKind, ContentState, ReviewOperation } from "@/lib/content-workflow";

export function ContentReviewControls({ kind, id, state, superAdmin }: {
  kind: ContentKind;
  id: string;
  state: ContentState & { reviewNote?: string | null };
  superAdmin: boolean;
}) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function run(operation: ReviewOperation) {
    setBusy(true);
    setError("");
    try {
      const result = await reviewContent(kind, id, state.contentVersion, operation, note);
      if (!result.success) setError(result.error ?? "Operasi gagal.");
      else router.refresh();
    } catch {
      setError("Operasi gagal. Muat ulang sebelum mencoba kembali.");
    } finally { setBusy(false); }
  }
  const operations: { operation: ReviewOperation; label: string }[] = [];
  if (["DRAFT", "REVISION_REQUIRED"].includes(state.reviewStatus) &&
      state.status !== "ARCHIVED" && state.status !== "PUBLISHED") {
    operations.push({ operation: "submit", label: "Ajukan review" });
  }
  if (superAdmin) {
    if (state.reviewStatus === "PENDING_REVIEW") {
      operations.push({ operation: "approve", label: "Setujui" });
      operations.push({ operation: "revision", label: "Minta revisi" });
    }
    operations.push({ operation: "publish", label: "Terbitkan langsung" });
    operations.push({ operation: "unpublish", label: "Batalkan publikasi" });
    operations.push({ operation: "archive", label: "Arsipkan" });
  }
  return <div className="space-y-3 rounded-md border border-neutral-200 p-4">
    <p>Status review: {state.reviewStatus} · Versi {state.contentVersion}</p>
    <p className="text-sm text-neutral-500">
      Aksi review berlaku pada versi tersimpan. Simpan perubahan form terlebih dahulu.
    </p>
    {state.reviewNote && <p>Catatan reviewer: {state.reviewNote}</p>}
    {superAdmin && state.reviewStatus === "PENDING_REVIEW" && <textarea
      aria-label="Alasan revisi" value={note}
      onChange={(event) => setNote(event.target.value)} maxLength={5000}
      className="w-full rounded border p-2" placeholder="Alasan revisi"
    />}
    <div className="flex flex-wrap gap-2">{operations.map(({ operation, label }) =>
      <button key={operation} type="button" disabled={busy}
        onClick={() => run(operation)} className="rounded border px-3 py-2 text-sm">
        {label}
      </button>)}</div>
    {error && <p role="alert" className="text-red-600">{error}</p>}
  </div>;
}
