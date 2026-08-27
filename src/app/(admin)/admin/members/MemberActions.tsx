"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteMember, toggleMemberActive } from "@/actions/member";

type Props = {
  memberId: string;
  memberName: string;
  isActive: boolean;
  isCurrentUser: boolean;
};

export function MemberActions({
  memberId,
  memberName,
  isActive,
  isCurrentUser,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleToggle() {
    startTransition(async () => {
      await toggleMemberActive(memberId);
      router.refresh();
    });
  }

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteMember(memberId);

      if (result.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        setError(result.error ?? "Gagal menghapus anggota.");
      }
    });
  }

  return (
    <>
      <div className="inline-flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending || isCurrentUser}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md border border-neutral-200 bg-white text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
          title={isActive ? "Nonaktifkan akun" : "Aktifkan akun"}
          aria-label={isActive ? "Nonaktifkan akun" : "Aktifkan akun"}
        >
          {isActive ? (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18.364 18.364A9 9 0 0 1 5.636 5.636m12.728 12.728A9 9 0 0 0 5.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ) : (
            <svg
              className="h-3.5 w-3.5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.6}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          )}
        </button>

        <a
          href={`/admin/members/${memberId}/edit`}
          className="inline-flex h-8 items-center rounded-md border border-neutral-200 bg-white px-2.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          Edit
        </a>

        <button
          type="button"
          onClick={() => {
            setError("");
            setShowConfirm(true);
          }}
          disabled={isCurrentUser}
          className="inline-flex h-8 items-center rounded-md border border-red-200 bg-white px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
          title={
            isCurrentUser
              ? "Tidak dapat menghapus akun sendiri"
              : "Hapus anggota"
          }
        >
          Hapus
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
            <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-red-600">
                    Konfirmasi
                  </p>
                  <h2 className="mt-1 text-lg font-bold tracking-tight text-neutral-900">
                    Hapus Anggota?
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowConfirm(false);
                    setError("");
                  }}
                  disabled={isPending}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-700 disabled:opacity-40"
                  aria-label="Tutup"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.75}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18 18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <p className="text-sm leading-6 text-neutral-600">
                Apakah Anda yakin ingin menghapus{" "}
                <strong className="font-semibold text-neutral-900">
                  {memberName}
                </strong>
                ? Semua data terkait akan ikut terhapus.
              </p>

              {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-neutral-100 bg-neutral-50/50 px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                disabled={isPending}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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