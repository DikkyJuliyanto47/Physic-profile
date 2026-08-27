"use client";

import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { NewsCategory, ContentStatus } from "@/generated/prisma/client";
import {
  createNews,
  updateNews,
  type ActionResponse,
  type NewsInput,
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

const fieldClassName =
  "h-10 w-full rounded-md border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

const textareaClassName =
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

export function NewsForm({ mode, initialData }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
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
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
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

  function handleSlugChange(e: ChangeEvent<HTMLInputElement>) {
    setAutoSlug(false);
    setForm((prev) => ({
      ...prev,
      slug: e.target.value,
    }));
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.size > 1 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 1 MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload gagal.");
        return;
      }

      setPreviewUrl(data.url);
      setForm((prev) => ({
        ...prev,
        imageUrl: data.url,
      }));
    } catch {
      setError("Terjadi kesalahan saat mengunggah gambar.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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

  const isSuccess = searchParams.get("success") === "true";
  const successMessage = isSuccess
    ? mode === "create"
      ? "Berita berhasil dibuat."
      : "Perubahan berhasil disimpan."
    : "";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {isSuccess && (
        <div className="flex items-start justify-between gap-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <svg
              className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
            <p className="text-sm font-medium text-emerald-700">
              {successMessage}
            </p>
          </div>

          <button
            type="button"
            aria-label="Tutup notifikasi"
            onClick={() => {
              const url = new URL(window.location.href);
              url.searchParams.delete("success");
              window.history.replaceState({}, "", url.toString());
              router.refresh();
            }}
            className="shrink-0 text-emerald-600 transition-colors hover:text-emerald-800"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2.5 rounded-md border border-red-200 bg-red-50 px-4 py-3">
          <svg
            className="mt-0.5 h-4 w-4 shrink-0 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m0 3.75h.008M10.29 3.86l-7.2 12.48A1.75 1.75 0 004.6 19h14.8a1.75 1.75 0 001.515-2.66l-7.2-12.48a1.75 1.75 0 00-3.03 0z"
            />
          </svg>
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <section className="space-y-5">
        <div>
          <FieldLabel required>Judul</FieldLabel>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Judul berita..."
            className={fieldClassName}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <FieldLabel>Slug</FieldLabel>
            <input
              name="slug"
              value={form.slug ?? ""}
              onChange={handleSlugChange}
              placeholder="judul-berita"
              className={fieldClassName}
            />
            <p className="mt-1.5 text-xs text-neutral-400">
              Slug dibuat otomatis dari judul.
            </p>
          </div>

          <div>
            <FieldLabel required>Kategori</FieldLabel>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className={fieldClassName}
            >
              {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel required>Status</FieldLabel>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className={fieldClassName}
            >
              <option value="DRAFT">Draf</option>
              <option value="PUBLISHED">Terbitkan</option>
            </select>
          </div>

          <div>
            <FieldLabel>Gambar</FieldLabel>

            <label
              className={`flex min-h-10 cursor-pointer items-center rounded-md border border-dashed px-3.5 transition-colors ${
                uploading
                  ? "cursor-not-allowed border-neutral-200 bg-neutral-50"
                  : "border-neutral-300 bg-neutral-50/40 hover:border-primary-300 hover:bg-primary-50/30"
              }`}
            >
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageUpload}
                disabled={uploading}
                className="sr-only"
              />

              <div className="flex min-w-0 items-center gap-2.5">
                <svg
                  className="h-4 w-4 shrink-0 text-neutral-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5V7.25A2.25 2.25 0 015.25 5h13.5A2.25 2.25 0 0121 7.25v9.5A2.25 2.25 0 0118.75 19H8.25M3 16.5l4.5-4.5 3 3 3.75-4.5L21 16.5M3 16.5V18a1 1 0 001 1h1.5"
                  />
                </svg>

                <span className="truncate text-sm text-neutral-600">
                  {uploading
                    ? "Mengunggah gambar..."
                    : previewUrl
                      ? "Ganti gambar"
                      : "Pilih gambar"}
                </span>
              </div>
            </label>

            <p className="mt-1.5 text-xs text-neutral-400">
              PNG, JPG, atau WebP. Maksimal 1 MB.
            </p>
          </div>
        </div>

        {previewUrl && (
          <div className="overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
            <img
              src={previewUrl}
              alt="Preview gambar berita"
              className="h-48 w-full object-cover sm:h-56"
            />
          </div>
        )}
      </section>

      <section className="border-t border-neutral-100 pt-7">
        <div>
          <FieldLabel>Ringkasan</FieldLabel>
          <textarea
            name="excerpt"
            value={form.excerpt ?? ""}
            onChange={handleChange}
            rows={3}
            placeholder="Ringkasan singkat berita..."
            className={`${textareaClassName} resize-y`}
          />
          <p className="mt-1.5 text-xs text-neutral-400">
            Ringkasan digunakan sebagai pengantar berita.
          </p>
        </div>
      </section>

      <section className="border-t border-neutral-100 pt-7">
        <div>
          <FieldLabel required>Konten</FieldLabel>
          <textarea
            name="content"
            value={form.content}
            onChange={handleChange}
            rows={14}
            required
            placeholder="Tulis konten berita di sini..."
            className={`${textareaClassName} min-h-80 resize-y`}
          />
        </div>
      </section>

      <div className="flex flex-col-reverse gap-2.5 border-t border-neutral-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="h-10 rounded-md border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="h-10 rounded-md bg-primary-600 px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Berita"
              : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}