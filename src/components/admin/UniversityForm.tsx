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
  const [error, setError] = useState("");
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createUniversity(form);
    } else {
      result = await updateUniversity(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/perguruan-tinggi");
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Logo URL
          </label>
          <input
            name="logoUrl"
            value={form.logoUrl ?? ""}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
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
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
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
              ? "Buat Kampus"
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
