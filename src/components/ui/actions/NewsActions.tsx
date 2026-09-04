"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { deleteNews, toggleNewsStatus } from "@/actions/news";

type Props = {
  newsId: string;
  newsTitle: string;
  currentStatus: string;
};

export function NewsActions({
  newsId,
  newsTitle,
  currentStatus,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  function handleToggle() {
    startTransition(async () => {
      await toggleNewsStatus(newsId);
      router.refresh();
    });
  }

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteNews(newsId);

      if (result.success) {
        setShowConfirm(false);
        router.refresh();
      } else {
        setError(result.error ?? "Gagal menghapus.");
      }
    });
  }

  const isPublished = currentStatus === "PUBLISHED";

  return (
    <>
      <div className="inline-flex items-center gap-1">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          title={isPublished ? "Kembalikan ke draf" : "Terbitkan"}
          aria-label={isPublished ? "Kembalikan ke draf" : "Terbitkan"}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPublished ? (
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
              strokeWidth={1.5}
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

        <a
          href={`/admin/news/${newsId}/edit`}
          className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        >
          Edit
        </a>

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
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-neutral-950/45 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowConfirm(false);
              setError("");
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-news-title"
            className="w-full max-w-md overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-elevated"
          >
            <div className="p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
                  <svg
                    className="h-4.5 w-4.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.75}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.2 12.48A1.75 1.75 0 004.6 19h14.8a1.75 1.75 0 001.515-2.66l-7.2-12.48a1.75 1.75 0 00-3.03 0z"
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <h3
                    id="delete-news-title"
                    className="text-base font-semibold text-neutral-900 sm:text-lg"
                  >
                    Hapus Berita?
                  </h3>

                  <p className="mt-1.5 text-sm leading-5 text-neutral-600">
                    Apakah Anda yakin ingin menghapus{" "}
                    <strong className="font-semibold text-neutral-800">
                      &ldquo;{newsTitle}&rdquo;
                    </strong>
                    ? Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mt-4 rounded-md border border-red-100 bg-red-50 px-3.5 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 bg-neutral-50/60 p-4 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                disabled={isPending}
                className="h-9 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="h-9 rounded-md bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
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