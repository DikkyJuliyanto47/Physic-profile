"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  createUniversity,
  updateUniversity,
  type UniversityInput,
  type ActionResponse,
} from "@/actions/university";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    name: string;
    shortName: string | null;
    slug: string | null;
    address: string | null;
    deptUrl: string | null;
    websiteUrl: string | null;
    logoUrl: string | null;
    description: string | null;
  };
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function UniversityForm({ mode, initialData }: Props) {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [autoSlug, setAutoSlug] = useState(mode === "create");

  const [form, setForm] = useState<UniversityInput>({
    name: initialData?.name ?? "",
    shortName: initialData?.shortName ?? "",
    slug: initialData?.slug ?? "",
    address: initialData?.address ?? "",
    deptUrl: initialData?.deptUrl ?? "",
    websiteUrl: initialData?.websiteUrl ?? "",
    logoUrl: initialData?.logoUrl ?? "",
    description: initialData?.description ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;

    setForm((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "name" && autoSlug) {
        next.slug = slugify(value);
      }

      return next;
    });
  }

  function handleSlugChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAutoSlug(false);
    setForm((prev) => ({ ...prev, slug: e.target.value }));
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setUploadError("");

    if (file.size > 1 * 1024 * 1024) {
      setUploadError("Ukuran gambar maksimal 1 MB.");
      e.target.value = "";
      return;
    }

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setUploadError("Format gambar harus PNG, JPG, atau WebP.");
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
        setUploadError(data.error || "Upload gagal.");
        return;
      }

      setForm((prev) => ({
        ...prev,
        logoUrl: data.url,
      }));
    } catch {
      setUploadError("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (uploading) {
      return;
    }

    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createUniversity(form);
    } else {
      result = await updateUniversity(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/universities");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Nama Kampus <span className="text-red-500">*</span>
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            placeholder="Universitas Negeri Surabaya"
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Singkatan
          </label>

          <input
            name="shortName"
            value={form.shortName ?? ""}
            onChange={handleChange}
            placeholder="UNESA"
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Slug
          </label>

          <input
            name="slug"
            value={form.slug ?? ""}
            onChange={handleSlugChange}
            placeholder="unesa"
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />

          <p className="mt-1 text-xs text-neutral-500">
            Otomatis dari nama kampus. Ubah jika perlu.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Alamat
          </label>

          <input
            name="address"
            value={form.address ?? ""}
            onChange={handleChange}
            placeholder="Jl. Ketintang No. 156, Surabaya"
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Dept URL
          </label>

          <input
            name="deptUrl"
            value={form.deptUrl ?? ""}
            onChange={handleChange}
            placeholder="https://.../departemen"
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Website URL
          </label>

          <input
            name="websiteUrl"
            value={form.websiteUrl ?? ""}
            onChange={handleChange}
            placeholder="https://unesa.ac.id"
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Logo Kampus
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex h-32 w-32 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-neutral-50">
              {form.logoUrl ? (
                <img
                  src={form.logoUrl}
                  alt="Preview logo kampus"
                  className="h-full w-full object-contain p-3"
                />
              ) : (
                <span className="px-3 text-center text-xs text-neutral-400">
                  Belum ada logo
                </span>
              )}
            </div>

            <div className="flex-1">
              <label
                className={`flex min-h-32 cursor-pointer items-center justify-center rounded-md border border-dashed px-4 py-5 text-center transition-colors ${
                  uploading
                    ? "cursor-not-allowed border-neutral-200 bg-neutral-50"
                    : "border-neutral-300 bg-neutral-50 hover:border-primary-400 hover:bg-primary-50/30"
                }`}
              >
                <div>
                  <svg
                    className="mx-auto h-7 w-7 text-neutral-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5V19a2 2 0 002 2h14a2 2 0 002-2v-2.5M16.5 8.25L12 3.75m0 0L7.5 8.25M12 3.75V16.5"
                    />
                  </svg>

                  <p className="mt-2 text-sm font-medium text-neutral-700">
                    {uploading
                      ? "Mengunggah gambar..."
                      : form.logoUrl
                        ? "Ganti gambar"
                        : "Pilih gambar"}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    PNG, JPG, atau WebP. Maksimal 1 MB.
                  </p>
                </div>

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading || isSubmitting}
                  className="sr-only"
                />
              </label>

              {uploadError && (
                <p className="mt-2 text-xs text-red-600">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Deskripsi
          </label>

          <textarea
            name="description"
            value={form.description ?? ""}
            onChange={handleChange}
            rows={3}
            placeholder="Deskripsi singkat tentang kampus..."
            className="w-full rounded-md border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Kampus"
              : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting || uploading}
          className="rounded-md border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}