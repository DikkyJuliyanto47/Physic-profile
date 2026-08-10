"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { markAsRead, markAsUnread, deleteMessage } from "@/actions/message";

type Props = {
  messageId: string;
  messageSubject: string;
  currentStatus: string;
};

export function MessageActions({
  messageId,
  messageSubject,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleToggleRead() {
    startTransition(async () => {
      if (currentStatus === "UNREAD") {
        await markAsRead(messageId);
      } else {
        await markAsUnread(messageId);
      }
      router.refresh();
    });
  }

  function handleDelete() {
    setError("");
    startTransition(async () => {
      const result = await deleteMessage(messageId);
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
        <button
          onClick={handleToggleRead}
          disabled={isPending}
          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
          title={
            currentStatus === "UNREAD"
              ? "Tandai sudah dibaca"
              : "Tandai belum dibaca"
          }
        >
          {currentStatus === "UNREAD" ? (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 2.004l-7.75 3.875a2.25 2.25 0 01-2.134 0L3.932 12.91a2.25 2.25 0 01-1.183-2.004V9M3.932 12.91L12 17.025l8.068-4.115M12 17.025v-5.25" />
            </svg>
          )}
        </button>
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
              Hapus Pesan?
            </h3>
            <p className="mt-2 text-sm text-neutral-600">
              Apakah Anda yakin ingin menghapus pesan{" "}
              <strong>&ldquo;{messageSubject}&rdquo;</strong>? Tindakan ini
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
