"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteEvent, toggleEventStatus } from "@/actions/event";

type Props = {
  eventId: string;
  eventTitle: string;
  currentStatus: string;
};

export function EventActions({
  eventId,
  eventTitle,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleToggle() {
    startTransition(async () => {
      await toggleEventStatus(eventId);
      router.refresh();
    });
  }

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteEvent(eventId);

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
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          title={
            currentStatus === "PUBLISHED"
              ? "Kembalikan ke draf"
              : "Terbitkan"
          }
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800 disabled:opacity-50"
        >
          {currentStatus === "PUBLISHED" ? (
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
                d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
              />
            </svg>
          ) : (
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
                d="M4.5 12.75l6 6 9-13.5"
              />
            </svg>
          )}
        </button>

        <Link
          href={`/admin/events/${eventId}/edit`}
          className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Hapus
        </button>
      </div>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-event-title"
        >
          <div className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-6 shadow-elevated">
            <h3
              id="delete-event-title"
              className="text-lg font-semibold tracking-tight text-neutral-900"
            >
              Hapus Event?
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-600">
              Apakah Anda yakin ingin menghapus{" "}
              <strong className="font-semibold text-neutral-800">
                &ldquo;{eventTitle}&rdquo;
              </strong>
              ? Tindakan ini tidak dapat dibatalkan.
            </p>

            {error && (
              <div className="mt-4 border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
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