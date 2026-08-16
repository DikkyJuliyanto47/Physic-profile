"use client";

import { useState } from "react";
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

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export function GalleryForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseInt(value, 10) || 0
            : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createGalleryItem(form);
    } else {
      result = await updateGalleryItem(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/gallery");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan.");
    }
  }

  const isVideo = form.mediaType === "VIDEO";
  const embedUrl = isVideo ? getYouTubeEmbedUrl(form.mediaUrl) : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Judul <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Judul media..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tipe Media <span className="text-red-500">*</span>
          </label>
          <select
            name="mediaType"
            value={form.mediaType}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {MEDIA_TYPE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Kategori / Tag Event
          </label>
          <input
            name="category"
            value={form.category ?? ""}
            onChange={handleChange}
            placeholder="Muswil 2026, Workshop, etc."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          URL Media <span className="text-red-500">*</span>
        </label>
        <input
          name="mediaUrl"
          value={form.mediaUrl}
          onChange={handleChange}
          required
          placeholder={
            isVideo
              ? "https://youtube.com/watch?v=... atau https://youtu.be/..."
              : "https://example.com/photo.jpg"
          }
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        <p className="mt-1 text-xs text-neutral-500">
          {isVideo
            ? "Gunakan URL YouTube. Embed akan otomatis dibuat."
            : "URL langsung ke gambar (jpg, png, webp, dll)."}
        </p>
      </div>

      {/* Preview */}
      {form.mediaUrl && (
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
          <p className="mb-2 text-xs font-medium text-neutral-500">Preview:</p>
          {isVideo && embedUrl ? (
            <div className="aspect-video overflow-hidden rounded-lg">
              <iframe
                src={embedUrl}
                className="h-full w-full"
                allowFullScreen
                title="Video preview"
              />
            </div>
          ) : !isVideo && form.mediaUrl ? (
            <img
              src={form.mediaUrl}
              alt="Preview"
              className="max-h-48 rounded-lg object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : null}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Deskripsi / Caption
        </label>
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          rows={3}
          placeholder="Deskripsi atau caption media..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex items-end">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              name="isFeatured"
              checked={form.isFeatured}
              onChange={handleChange}
              className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            Tampilkan di Homepage (Featured)
          </label>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Urutan Tampil
          </label>
          <input
            type="number"
            name="sortOrder"
            value={form.sortOrder}
            onChange={handleChange}
            min={0}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <p className="mt-1 text-xs text-neutral-500">
            Semakin kecil, semakin awal ditampilkan.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
