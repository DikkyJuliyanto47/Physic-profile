"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deletePublication } from "@/actions/publication";

type Props = {
  publicationId: string;
  publicationTitle: string;
};

export function PublicationActions({
  publicationId,
  publicationTitle,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deletePublication(publicationId);
      if (result.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        setError(result.error ?? "Gagal menghapus.");
      }
    });
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <a
          href={`/admin/publikasi/${publicationId}/edit`}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Edit
        </a>
        <button
          onClick={() => setShowConfirm(true)}
          className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Hapus
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-elevated">
            <h3 className="text-lg font-semibold text-neutral-900">
              Hapus Publikasi?
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Apakah Anda yakin ingin menghapus{" "}
              <strong>&ldquo;{publicationTitle}&rdquo;</strong>? Tindakan ini
              tidak dapat dibatalkan.
            </p>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
              >
                {isPending ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
