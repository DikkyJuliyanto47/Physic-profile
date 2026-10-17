"use client";

import type { ContentVersion } from "@/lib/content-workflow";

import { useUploadLifecycle } from "@/lib/use-upload-lifecycle";

import {
  MAX_FILE_SIZE,
  ALLOWED_UPLOAD_TYPES,
  IMAGE_UPLOAD_ACCEPT,
} from "@/lib/upload-constraints";

import type { ChangeEvent, FormEvent } from "react";
import { useId, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

import { ContentStatus, NewsCategory } from "@/generated/prisma/browser";
import {
  createNews,
  updateNews,
  type ActionResponse,
  type NewsInput,
} from "@/actions/news";

import type { ContentActor } from "@/lib/content-workflow";

type Props = {
  expectedVersion?: ContentVersion;
  actor: ContentActor;
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    category: NewsCategory;
    excerpt: string | null;
    content: string;
    imageUrl: string | null;
    status: ContentStatus;
    eventDate?: Date | null;
  };
};

const fieldClassName =
  "h-10 w-full rounded-md border border-neutral-200 bg-white px-3.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

const textareaClassName =
  "w-full rounded-md border border-neutral-200 bg-white px-3.5 py-3 text-sm leading-6 text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500";

const NEWS_CATEGORY_OPTIONS: Array<{ value: NewsCategory; label: string }> = [
  { value: NewsCategory.ORGANISASI, label: "Organisasi" },
  { value: NewsCategory.SEMINAR, label: "Seminar" },
  { value: NewsCategory.WORKSHOP, label: "Workshop" },
  { value: NewsCategory.PERTEMUAN_RUTIN, label: "Pertemuan Rutin" },
  { value: NewsCategory.KERJASAMA, label: "Kerjasama" },
  { value: NewsCategory.PRESTASI_ANGGOTA, label: "Prestasi Anggota" },
];

function FieldLabel({
  htmlFor,
  children,
  required = false,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-sm font-medium text-neutral-700"
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

export function NewsForm({ expectedVersion, mode, initialData, actor }: Props) {
  const [draftVersion] = useState(expectedVersion);
  const formId = useId();
  const router = useRouter();
  const submitInFlight = useRef(false);
  const trackUpload = useUploadLifecycle();
  const searchParams = useSearchParams();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.imageUrl ?? "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<NewsInput>({
    title: initialData?.title ?? "",
    category: initialData?.category ?? NewsCategory.ORGANISASI,
    excerpt: initialData?.excerpt ?? "",
    content: initialData?.content ?? "",
    imageUrl: initialData?.imageUrl ?? "",
    status: initialData?.status ?? ContentStatus.DRAFT,
    eventDate: initialData?.eventDate?.toISOString().slice(0, 10) ?? "",
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      if (name === "category")
        return { ...prev, category: value as NewsCategory };
      if (name === "status") return { ...prev, status: value as ContentStatus };

      return { ...prev, [name]: value };
    });
  }

  async function handleImageUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.size > MAX_FILE_SIZE) {
      setError("Ukuran file maksimal 1 MB.");
      e.target.value = "";
      return;
    }

    if (file.size === 0) {
      setError("File kosong.");
      e.target.value = "";
      return;
    }

    if (!file.name || /[\\/\u0000-\u001f\u007f]/.test(file.name)) {
      setError("Nama file tidak valid.");
      e.target.value = "";
      return;
    }

    const dotIndex = file.name.lastIndexOf(".");
    const extension =
      dotIndex > 0 ? file.name.slice(dotIndex + 1).toLowerCase() : "";
    const allowedExtensions = ALLOWED_UPLOAD_TYPES[file.type];
    if (!allowedExtensions || !allowedExtensions.includes(extension)) {
      setError("Format file tidak didukung.");
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

      trackUpload(data.url);
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
    if (submitInFlight.current) return;

    setError("");
    submitInFlight.current = true;
    setIsSubmitting(true);
    let navigating = false;

    try {
      const payload: NewsInput = form;

      const result: ActionResponse =
        mode === "create"
          ? await createNews(payload)
          : await updateNews(initialData!.id, payload, draftVersion!);

      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        return;
      }

      navigating = true;
      router.push(
        result.pending
          ? "/admin/submissions?result=submitted"
          : "/admin/news?result=saved",
      );
      router.refresh();
    } catch (error) {
      console.error(" [NewsForm] Submit gagal:", error);
      setError(
        "Koneksi atau layanan bermasalah. Periksa koneksi internet Anda atau coba lagi nanti.",
      );
    } finally {
      if (!navigating) {
        submitInFlight.current = false;
        setIsSubmitting(false);
      }
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
      {actor.role === "ADMIN" && (
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">
          Berita akan diajukan untuk review. Versi publik tetap berlaku sampai
          disetujui.
        </p>
      )}
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
          <FieldLabel htmlFor={`${formId}-title`} required>
            Judul
          </FieldLabel>
          <input
            id={`${formId}-title`}
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            placeholder="Judul berita..."
            className={fieldClassName}
          />
        </div>

        <div>
          <FieldLabel htmlFor={`${formId}-eventDate`}>
            Tanggal Kegiatan
          </FieldLabel>
          <input
            type="date"
            id={`${formId}-eventDate`}
            name="eventDate"
            value={form.eventDate ?? ""}
            onChange={handleChange}
            className={fieldClassName}
          />
          <p className="mt-1.5 text-xs text-neutral-400">
            Isi tanggal pelaksanaan kegiatan, bukan tanggal publikasi berita.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <div>
            <FieldLabel htmlFor={`${formId}-category`} required>
              Kategori
            </FieldLabel>
            <select
              id={`${formId}-category`}
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className={fieldClassName}
            >
              <option value="" disabled>
                Pilih kategori
              </option>
              {NEWS_CATEGORY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {actor.role === "SUPER_ADMIN" && (
            <div>
              <FieldLabel htmlFor={`${formId}-status`} required>
                Status
              </FieldLabel>
              <select
                id={`${formId}-status`}
                name="status"
                value={form.status}
                onChange={handleChange}
                className={fieldClassName}
              >
                <option value={ContentStatus.DRAFT}>Draf</option>
                <option value={ContentStatus.PUBLISHED}>Terbitkan</option>
                {mode === "edit" && (
                  <option value={ContentStatus.ARCHIVED}>Arsipkan</option>
                )}
              </select>
            </div>
          )}

          <div>
            <FieldLabel htmlFor={`${formId}-image`}>Gambar</FieldLabel>

            <label
              htmlFor={`${formId}-image`}
              className={`flex min-h-10 cursor-pointer items-center rounded-md border border-dashed px-3.5 transition-colors ${
                uploading
                  ? "cursor-not-allowed border-neutral-200 bg-neutral-50"
                  : "border-neutral-300 bg-neutral-50/40 hover:border-primary-300 hover:bg-primary-50/30"
              }`}
            >
              <input
                id={`${formId}-image`}
                type="file"
                accept={IMAGE_UPLOAD_ACCEPT}
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
            <Image
              src={previewUrl}
              alt="Preview gambar berita"
              width={800}
              height={224}
              unoptimized
              className="h-48 w-full object-cover sm:h-56"
            />
          </div>
        )}
      </section>

      <section className="border-t border-neutral-100 pt-7">
        <div>
          <FieldLabel htmlFor={`${formId}-excerpt`}>Ringkasan</FieldLabel>
          <textarea
            id={`${formId}-excerpt`}
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
          <FieldLabel htmlFor={`${formId}-content`} required>
            Konten
          </FieldLabel>
          <textarea
            id={`${formId}-content`}
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
