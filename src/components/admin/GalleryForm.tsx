"use client";

import { ChangeEvent, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MediaType } from "@/generated/prisma/client";
import {
  createGalleryItem,
  updateGalleryItem,
  type GalleryInput,
  type ActionResponse,
} from "@/actions/gallery";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    mediaType: MediaType;
    mediaUrl: string;
    category: string | null;
    description: string | null;
    isFeatured: boolean;
    sortOrder: number;
  };
};

const MEDIA_TYPE_OPTIONS = [
  { value: "PHOTO", label: "Foto / Gambar" },
  { value: "VIDEO", label: "Video" },
];

const inputClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

const textareaClass =
  "w-full rounded-md border border-neutral-200 bg-white px-3.5 py-3 text-sm leading-6 text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="mb-1.5 block text-sm font-medium text-neutral-700">
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function GalleryForm({ mode, initialData }: Props) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(initialData?.mediaUrl ?? "");

  const [form, setForm] = useState<GalleryInput>({
    title: initialData?.title ?? "",
    mediaType: initialData?.mediaType ?? "PHOTO",
    mediaUrl: initialData?.mediaUrl ?? "",
    category: initialData?.category ?? "",
    description: initialData?.description ?? "",
    isFeatured: initialData?.isFeatured ?? false,
    sortOrder: initialData?.sortOrder ?? 0,
  });

  function handleChange(
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? Number.parseInt(value, 10) || 0
            : value,
    }));

    if (name === "mediaUrl") {
      setPreviewUrl(value);
    }

    if (name === "mediaType" && value === "VIDEO") {
      setPreviewUrl(form.mediaUrl);
    }
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar.");
      e.target.value = "";
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 1 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Upload gagal.");
        return;
      }

      setPreviewUrl(data.url);

      setForm((prev) => ({
        ...prev,
        mediaUrl: data.url,
        mediaType: "PHOTO",
      }));
    } catch {
      setError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    try {
      if (mode === "create") {
        result = await createGalleryItem(form);
      } else {
        result = await updateGalleryItem(initialData!.id, form);
      }
    } catch {
      setIsSubmitting(false);
      setError("Terjadi kesalahan saat menyimpan media.");
      return;
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/gallery");
      router.refresh();
      return;
    }

    setError(result.error ?? "Terjadi kesalahan.");
  }

  const isVideo = form.mediaType === "VIDEO";
  const embedUrl = isVideo ? getYouTubeEmbedUrl(form.mediaUrl) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section>
        <div className="mb-5 border-b border-neutral-200 pb-3">
          <h2 className="text-sm font-semibold text-neutral-900">Media</h2>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Tambahkan foto atau video yang akan ditampilkan pada galeri.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <FieldLabel required>Judul</FieldLabel>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Judul media..."
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <FieldLabel required>Tipe Media</FieldLabel>

              <select
                name="mediaType"
                value={form.mediaType}
                onChange={handleChange}
                className={inputClass}
              >
                {MEDIA_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <FieldLabel>Kategori / Tag Event</FieldLabel>

              <input
                name="category"
                value={form.category ?? ""}
                onChange={handleChange}
                placeholder="Muswil 2026, Workshop, dll."
                className={inputClass}
              />
            </div>
          </div>

          {isVideo ? (
            <div>
              <FieldLabel required>URL YouTube</FieldLabel>

              <input
                name="mediaUrl"
                value={form.mediaUrl}
                onChange={handleChange}
                required
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                className={inputClass}
              />

              <p className="mt-1.5 text-xs text-neutral-400">
                Gunakan URL video YouTube. Video akan di-embed otomatis.
              </p>
            </div>
          ) : (
            <div>
              <FieldLabel required>Gambar</FieldLabel>

              <label
                className={`flex min-h-12 cursor-pointer items-center justify-between gap-4 rounded-md border border-dashed px-3.5 transition-colors ${
                  uploading
                    ? "cursor-not-allowed border-primary-200 bg-primary-50"
                    : "border-neutral-300 bg-white hover:border-primary-400 hover:bg-neutral-50"
                }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-neutral-500">
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
                        d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75A2.25 2.25 0 0118.75 18.75H5.25A2.25 2.25 0 013 16.5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 15l4.5-4.5a2.25 2.25 0 013.182 0L15 15l2.25-2.25a2.25 2.25 0 013.182 0L21 13.5"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-700">
                      {uploading
                        ? "Mengunggah gambar..."
                        : "Pilih gambar dari perangkat"}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-400">
                      JPG, PNG, atau WebP · maksimal 1 MB
                    </p>
                  </div>
                </div>

                <span className="shrink-0 rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-xs font-medium text-neutral-600">
                  Pilih File
                </span>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="sr-only"
                />
              </label>

              {form.mediaUrl && (
                <p className="mt-2 truncate text-xs text-neutral-400">
                  {form.mediaUrl}
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {form.mediaUrl && (
        <section>
          <div className="mb-5 border-b border-neutral-200 pb-3">
            <h2 className="text-sm font-semibold text-neutral-900">Preview</h2>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Pratinjau media yang akan ditampilkan.
            </p>
          </div>

          <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
            {isVideo && embedUrl ? (
              <div className="aspect-video">
                <iframe
                  src={embedUrl}
                  className="h-full w-full"
                  allowFullScreen
                  title="Video preview"
                />
              </div>
            ) : !isVideo ? (
              <div className="flex min-h-64 items-center justify-center p-5">
                <Image
                  src={previewUrl}
                  alt="Preview"
                  width={960}
                  height={640}
                  unoptimized
                  className="max-h-112 w-auto max-w-full rounded-md object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ) : (
              <div className="flex min-h-64 items-center justify-center px-6 text-center text-sm text-neutral-500">
                URL YouTube belum valid untuk preview.
              </div>
            )}
          </div>
        </section>
      )}

      <section>
        <div className="mb-5 border-b border-neutral-200 pb-3">
          <h2 className="text-sm font-semibold text-neutral-900">
            Informasi Tambahan
          </h2>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Tambahkan caption dan pengaturan tampilan media.
          </p>
        </div>

        <div className="space-y-5">
          <div>
            <FieldLabel>Deskripsi / Caption</FieldLabel>

            <textarea
              name="description"
              value={form.description ?? ""}
              onChange={handleChange}
              rows={4}
              placeholder="Deskripsi atau caption media..."
              className={textareaClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <label className="flex min-h-11 items-center gap-3 rounded-md border border-neutral-200 bg-neutral-50 px-3.5">
              <input
                type="checkbox"
                name="isFeatured"
                checked={form.isFeatured}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />

              <span>
                <span className="block text-sm font-medium text-neutral-800">
                  Featured
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500">
                  Tampilkan sebagai media unggulan.
                </span>
              </span>
            </label>

            <div>
              <FieldLabel>Urutan Tampil</FieldLabel>

              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                min={0}
                className={inputClass}
              />

              <p className="mt-1.5 text-xs text-neutral-400">
                Semakin kecil, semakin awal ditampilkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex items-center gap-2 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Tambah Media"
              : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-md border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50 disabled:opacity-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}