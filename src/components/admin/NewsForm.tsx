"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
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
      router.push("/admin/news");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan.");
    }
  }

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
            URL Gambar
          </label>
          <input
            name="imageUrl"
            value={form.imageUrl ?? ""}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
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
