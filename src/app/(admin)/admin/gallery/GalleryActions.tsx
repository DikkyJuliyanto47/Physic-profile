"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { MediaType } from "@/generated/prisma/client";
import { deleteGalleryItem } from "@/actions/gallery";

type Props = {
  itemId: string;
  itemTitle: string;
  mediaType: MediaType;
  mediaUrl: string;
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function GalleryActions({
  itemId,
  itemTitle,
  mediaType,
  mediaUrl,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  const embedUrl =
    mediaType === "VIDEO" ? getYouTubeEmbedUrl(mediaUrl) : null;

  function handleDelete() {
    setError("");

    startTransition(async () => {
      const result = await deleteGalleryItem(itemId);

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
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Preview
        </button>

        <Link
          href={`/admin/gallery/${itemId}/edit`}
          className="rounded-md border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Edit
        </Link>

        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="rounded-md border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
        >
          Hapus
        </button>
      </div>

      {showPreview && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 sm:p-8"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-md bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-neutral-200 px-5 py-4">
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold text-neutral-900">
                  {itemTitle}
                </h3>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {mediaType === "VIDEO" ? "Video" : "Foto / Gambar"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowPreview(false)}
                className="shrink-0 rounded-md border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Tutup
              </button>
            </div>

            <div className="bg-neutral-950 p-4">
              {mediaType === "VIDEO" && embedUrl ? (
                <div className="aspect-video">
                  <iframe
                    src={embedUrl}
                    className="h-full w-full"
                    allowFullScreen
                    title={itemTitle}
                  />
                </div>
              ) : (
                <div className="flex max-h-[75vh] items-center justify-center">
                  <Image
                    src={mediaUrl}
                    alt={itemTitle}
                    width={1400}
                    height={900}
                    unoptimized
                    className="max-h-[75vh] w-auto max-w-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          onClick={() => {
            if (!isPending) {
              setShowConfirm(false);
              setError("");
            }
          }}
        >
          <div
            className="w-full max-w-md rounded-md bg-white"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="border-b border-neutral-200 px-5 py-4">
              <h3 className="text-base font-semibold text-neutral-900">
                Hapus Media?
              </h3>
            </div>

            <div className="px-5 py-5">
              <p className="text-sm leading-6 text-neutral-600">
                Apakah Anda yakin ingin menghapus{" "}
                <strong className="font-semibold text-neutral-900">
                  &ldquo;{itemTitle}&rdquo;
                </strong>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>

              {error && (
                <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-neutral-200 px-5 py-4">
              <button
                type="button"
                onClick={() => {
                  setShowConfirm(false);
                  setError("");
                }}
                disabled={isPending}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
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