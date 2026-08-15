"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteManagementPosition } from "@/actions/kepengurusan";

type Props = {
  positionId: string;
  positionTitle: string;
};

export function ManagementPositionActions({ positionId, positionTitle }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteManagementPosition(positionId);
      if (result.success) {
        setConfirmDelete(false);
        router.refresh();
      } else {
        setError(result.error ?? "Gagal menghapus posisi.");
      }
    });
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <a
          href={`?positionId=${positionId}`}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Edit
        </a>
        <button
          onClick={() => setConfirmDelete(true)}
          className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Hapus
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-elevated">
            <h3 className="text-lg font-semibold text-neutral-900">
              Hapus Posisi?
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Apakah Anda yakin ingin menghapus <strong>{positionTitle}</strong>?
            </p>

            {error && (
              <div className="mt-3 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setConfirmDelete(false);
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
