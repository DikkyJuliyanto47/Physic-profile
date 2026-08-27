"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createPublication,
  updatePublication,
  type PublicationInput,
  type ActionResponse,
} from "@/actions/publication";
import type { PublicationCategory } from "@/components/features/research/types";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    type: PublicationCategory;
    description: string | null;
    externalUrl: string | null;
    fileUrl: string | null;
    publishedAt: Date | null;
  };
};

const TYPE_LABELS: Record<PublicationCategory, string> = {
  JURNAL: "Jurnal",
  BUKU: "Buku",
  HKI: "HKI (Hak Kekayaan Intelektual)",
  PROSIDING: "Prosiding",
};

function toDatetimeLocal(date: Date | string | null): string {
  if (!date) return "";

  const d = new Date(date);
  const pad = (n: number) => String(n).padStart(2, "0");

  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100";

const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

export function PublicationForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<PublicationInput>({
    title: initialData?.title ?? "",
    type: initialData?.type ?? "JURNAL",
    description: initialData?.description ?? "",
    externalUrl: initialData?.externalUrl ?? "",
    fileUrl: initialData?.fileUrl ?? "",
    publishedAt: initialData?.publishedAt
      ? toDatetimeLocal(initialData.publishedAt)
      : "",
  });

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createPublication(form);
    } else {
      result = await updatePublication(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/publication");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className={labelClass}>
          Judul <span className="text-red-500">*</span>
        </label>

        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Judul publikasi..."
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={labelClass}>
            Tipe <span className="text-red-500">*</span>
          </label>

          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
            className={inputClass}
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="publishedAt" className={labelClass}>
            Tanggal Publikasi
          </label>

          <input
            id="publishedAt"
            type="datetime-local"
            name="publishedAt"
            value={form.publishedAt}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Deskripsi
        </label>

        <textarea
          id="description"
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          rows={5}
          placeholder="Deskripsi publikasi..."
          className={`${inputClass} resize-y`}
        />

        <p className="mt-1.5 text-xs text-neutral-400">
          Gunakan deskripsi singkat yang membantu pengunjung memahami publikasi.
        </p>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-neutral-900">
            Referensi Publikasi
          </h2>
          <p className="mt-1 text-xs leading-5 text-neutral-500">
            Tambahkan tautan menuju sumber eksternal atau file publikasi.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="externalUrl" className={labelClass}>
              URL Eksternal
            </label>

            <input
              id="externalUrl"
              name="externalUrl"
              value={form.externalUrl ?? ""}
              onChange={handleChange}
              type="url"
              placeholder="https://..."
              className={inputClass}
            />

            <p className="mt-1.5 text-xs text-neutral-400">
              Halaman jurnal, DOI, situs penerbit, atau sumber terkait.
            </p>
          </div>

          <div>
            <label htmlFor="fileUrl" className={labelClass}>
              URL File
            </label>

            <input
              id="fileUrl"
              name="fileUrl"
              value={form.fileUrl ?? ""}
              onChange={handleChange}
              type="url"
              placeholder="https://..."
              className={inputClass}
            />

            <p className="mt-1.5 text-xs text-neutral-400">
              Tautan langsung menuju PDF atau dokumen publikasi.
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Publikasi"
              : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-md border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}