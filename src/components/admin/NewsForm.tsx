"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { NewsCategory, ContentStatus } from "@/generated/prisma/client";
import {
  createNews,
  updateNews,
  type NewsInput,
  type ActionResponse,
} from "@/actions/news";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    slug: string;
    category: NewsCategory;
    excerpt: string | null;
    content: string;
    imageUrl: string | null;
    status: ContentStatus;
  };
};

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function NewsForm({ mode, initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl ?? "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(mode === "create");

  const [form, setForm] = useState<NewsInput>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    category: initialData?.category ?? "ORGANISASI",
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    status: initialData?.status ?? "DRAFT",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "title" && autoSlug) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 1 MB.");
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Upload gagal.");
    } else {
      setPreviewUrl(data.url);
      setForm((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));
    }

    setUploading(false);
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAutoSlug(false);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createNews(form);
    } else {
      result = await updateNews(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/news?success=true");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan.");
    }
  }

  // Cek apakah ada parameter success di URL
  const isSuccess = searchParams.get("success") === "true";
  const successMessage = isSuccess 
    ? (mode === "create" ? "Berita berhasil dibuat!" : "Perubahan berhasil disimpan!")
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Notifikasi sukses tanpa useEffect */}
      {isSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700 flex items-center justify-between">
          <span>{successMessage}</span>
          <button
            type="button"
            onClick={() => {
              // Hapus parameter dari URL tanpa reload
              const url = new URL(window.location.href);
              url.searchParams.delete("success");
              window.history.replaceState({}, "", url.toString());
              // Refresh untuk update UI
              router.refresh();
            }}
            className="text-green-700 hover:text-green-900"
          >
            ✕
          </button>
        </div>
      )}

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
          placeholder="Judul berita..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Slug
          </label>
          <input
            name="slug"
            value={form.slug ?? ""}
            onChange={handleSlugChange}
            placeholder="judul-berita"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Kategori <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="DRAFT">Draf</option>
            <option value="PUBLISHED">Terbitkan</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Gambar
          </label>

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full rounded-lg border border-neutral-300 text-sm
                file:mr-4 file:rounded-md file:border-0
                file:bg-primary-600/10 file:px-4 file:py-2
                file:text-primary-700 file:transition-colors
                hover:file:bg-primary-600/20
                disabled:file:opacity-50"
          />

          {uploading && (
            <p className="mt-2 text-sm text-neutral-500">
              Mengunggah gambar...
            </p>
          )}

          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 h-40 w-full rounded-lg object-cover"
            />
          )}
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Ringkasan
        </label>
        <textarea
          name="excerpt"
          value={form.excerpt ?? ""}
          onChange={handleChange}
          rows={2}
          placeholder="Ringkasan singkat berita..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Konten <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          rows={10}
          required
          placeholder="Tulis konten berita di sini..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
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
              ? "Buat Berita"
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