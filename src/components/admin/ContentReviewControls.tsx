"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ReviewStatusBadge } from "./ReviewStatusBadge";
import { reviewContent, resubmitContent } from "@/actions/content-review";
import { contentPermissions } from "@/lib/content-permissions";
import { CONTENT_FIELDS, type ContentPayload } from "@/lib/content-fields";
import type {
  ContentActor,
  ContentKind,
  ContentState,
} from "@/lib/content-workflow";

export type ContentReferences = Record<string, { id: string; label: string }[]>;
const fieldClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-primary-500 focus:outline-none";
const buttonClass =
  "rounded-md border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50";

export function ContentReviewControls({
  id,
  kind,
  operation,
  actor,
  state,
  payload,
  before,
  references,
  canReview,
}: {
  id: string;
  kind: ContentKind;
  operation: "CREATE" | "UPDATE" | "DELETE";
  actor: ContentActor;
  state: ContentState & { reviewNote?: string | null };
  payload: ContentPayload;
  before: Record<string, unknown> | null;
  references: ContentReferences;
  canReview: boolean;
}) {
  const router = useRouter();
  const fieldId = useId();
  const inFlight = useRef(false);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ContentPayload>(payload);
  const permissions = contentPermissions(actor, state);
  const open =
    state.reviewStatus === "PENDING_REVIEW" ||
    state.reviewStatus === "REVISION_REQUIRED";
  const fields = CONTENT_FIELDS[kind];
  const choices = (key: string) => references[key] ?? [];
  function display(key: string, value: unknown) {
    if (value === null || value === undefined || value === "") return "—";
    if (typeof value === "boolean") return value ? "Ya" : "Tidak";
    return (
      choices(key).find((option) => option.id === value)?.label ?? String(value)
    );
  }
  function dateInput(value: unknown) {
    if (!value) return "";
    if (!/(?:Z|[+-]\d{2}:\d{2})$/.test(String(value))) return String(value);
    const date = new Date(String(value));
    return Number.isNaN(date.getTime())
      ? String(value)
      : new Date(date.getTime() + 7 * 3600000).toISOString().slice(0, -1);
  }
  async function run(
    decision: "approve" | "revision" | "resubmit",
    confirmed = false,
  ) {
    if (inFlight.current) return;
    if (decision === "approve" && operation === "DELETE" && !confirmed) {
      setConfirmDelete(true);
      return;
    }
    if (decision === "revision" && !note.trim()) {
      setError("Isi alasan penolakan terlebih dahulu.");
      return;
    }
    setConfirmDelete(false);
    inFlight.current = true;
    setBusy(true);
    setError("");
    try {
      const result =
        decision === "resubmit"
          ? await resubmitContent(id, state.contentVersion, draft)
          : await reviewContent(id, state.contentVersion, decision, note);
      if (!result.success) setError(result.error ?? "Operasi gagal.");
      else {
        setEditing(false);
        const url = new URL(window.location.href);
        url.searchParams.set(
          "result",
          decision === "approve"
            ? "approved"
            : decision === "revision"
              ? "rejected"
              : "resubmitted",
        );
        router.replace(url.pathname + url.search, { scroll: false });
        router.refresh();
      }
    } catch {
      setError("Operasi gagal. Muat ulang sebelum mencoba kembali.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <div className="space-y-4">
      <ReviewStatusBadge status={state.reviewStatus} />
      {state.reviewNote && (
        <p className="whitespace-pre-wrap rounded-md bg-red-50 p-3 text-sm text-red-700">
          Alasan penolakan: {state.reviewNote}
        </p>
      )}
      {open && (
        <p className="text-sm text-neutral-500">
          {operation === "CREATE"
            ? "Konten belum tampil publik."
            : "Versi publik tetap berlaku sampai pengajuan disetujui."}
        </p>
      )}
      {operation === "DELETE" &&
        kind === "managementPeriod" &&
        Array.isArray(before?.positions) && (
          <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
            Penghapusan periode juga menghapus {before.positions.length} jabatan
            di dalamnya.
          </p>
        )}

      {open && (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="w-full table-fixed text-left text-sm">
            <thead className="bg-neutral-50 text-neutral-500">
              <tr>
                <th className="w-1/4 p-3">Data</th>
                <th className="p-3">Versi saat diajukan</th>
                {operation !== "DELETE" && <th className="p-3">Usulan</th>}
              </tr>
            </thead>

            <tbody>
              {Object.entries(fields).map(([key, field]) => (
                <tr key={key} className="border-t border-neutral-100 align-top">
                  <th className="break-words p-3 font-medium text-neutral-700">
                    {field.label}
                  </th>
                  <td className="whitespace-pre-wrap break-words p-3 text-neutral-500">
                    {display(key, before?.[key])}
                  </td>
                  {operation !== "DELETE" && (
                    <td className="whitespace-pre-wrap break-words p-3 text-neutral-900">
                      {display(key, payload[key])}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {open && permissions.canEdit && !editing && (
        <button
          type="button"
          disabled={busy}
          className={buttonClass}
          onClick={() => setEditing(true)}
        >
          {operation === "DELETE"
            ? "Ajukan ulang penghapusan"
            : "Perbaiki pengajuan"}
        </button>
      )}

      {editing && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run("resubmit");
          }}
          className="space-y-4 rounded-md border border-neutral-200 p-4"
        >
          <fieldset disabled={busy} className="grid gap-4 sm:grid-cols-2">
            {operation !== "DELETE" &&
              Object.entries(fields).map(([key, field]) => {
                if (key === "status" && actor.role !== "SUPER_ADMIN")
                  return null;
                const inputId = `${fieldId}-${key}`;
                const value = draft[key];

                return;

              })}
          </fieldset>
          {operation === "DELETE" && (
            <p className="text-sm text-neutral-600">
              Versi konten terbaru akan dilampirkan untuk ditinjau ulang.
            </p>
          )}
          <div className="flex gap-2">
            <button disabled={busy} className={buttonClass}>
              {busy ? "Memproses..." : "Simpan dan ajukan ulang"}
            </button>
            <button
              type="button"
              disabled={busy}
              className={buttonClass}
              onClick={() => setEditing(false)}
            >
              Batal
            </button>
          </div>
        </form>
      )}
      {canReview && permissions.canReview && !editing && (
        <div className="space-y-3">
          <label
            htmlFor={`${fieldId}-note`}
            className="block text-sm font-medium text-neutral-700"
          >
            Alasan penolakan (wajib jika menolak)
          </label>
          <textarea
            id={`${fieldId}-note`}
            disabled={busy}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            maxLength={5000}
            className={fieldClass}
          />
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => void run("approve")}
              className="rounded-md bg-primary-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy
                ? "Memproses..."
                : operation === "DELETE"
                  ? "Setujui penghapusan"
                  : "Setujui perubahan"}
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void run("revision")}
              className={buttonClass}
            >
              Tolak dengan alasan
            </button>
          </div>
        </div>
      )}
      {confirmDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${fieldId}-delete-title`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
        >
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-elevated">
            <h3
              id={`${fieldId}-delete-title`}
              className="text-lg font-semibold text-neutral-900"
            >
              Setujui Penghapusan?
            </h3>
            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Konten{" "}
              <strong>
                {String(
                  before?.title ?? before?.name ?? before?.period ?? "Konten",
                )}{" "}
                (ID: {String(before?.id ?? id)})
              </strong>{" "}
              akan dihapus setelah pengajuan disetujui. Tindakan ini tidak dapat
              dibatalkan.
            </p>
            {kind === "managementPeriod" &&
              Array.isArray(before?.positions) && (
                <p className="mt-2 text-sm leading-6 text-neutral-600">
                  Seluruh {before.positions.length} jabatan dalam periode ini
                  juga akan dihapus.
                </p>
              )}
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={busy}
                className={buttonClass}
                onClick={() => setConfirmDelete(false)}
              >
                Batal
              </button>
              <button
                type="button"
                disabled={busy}
                className={buttonClass}
                onClick={() => void run("approve", true)}
              >
                Ya, Setujui Penghapusan
              </button>
            </div>
          </div>
        </div>
      )}
      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
