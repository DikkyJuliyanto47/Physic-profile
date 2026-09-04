"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteManagementPosition } from "@/actions/management";

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
      <div className="flex items-center justify-end gap-1">
        <Link
          href={`?positionId=${positionId}`}
          className="rounded-md px-2 py-1.5 text-[11px] font-semibold text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => setConfirmDelete(true)}
          className="rounded-md px-2 py-1.5 text-[11px] font-semibold text-red-600 transition-colors hover:bg-red-50"
        >
          Hapus
        </button>
      </div>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-elevated">
            <h3 className="text-lg font-semibold text-neutral-900">Hapus Posisi?</h3>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Apakah Anda yakin ingin menghapus <strong>{positionTitle}</strong> dari
              struktur kepengurusan?
            </p>

            {error && (
              <div className="mt-4 border-l-2 border-red-500 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmDelete(false);
                  setError("");
                }}
                className="rounded-md border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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