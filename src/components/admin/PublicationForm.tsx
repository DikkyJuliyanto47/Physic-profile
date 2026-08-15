"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PublicationType } from "@/generated/prisma/client";
import {
  createPublication,
  updatePublication,
  type PublicationInput,
  type ActionResponse,
} from "@/actions/publication";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    type: PublicationType;
    description: string | null;
    externalUrl: string | null;
    fileUrl: string | null;
    publishedAt: Date | null;
  };
};

const TYPE_LABELS: Record<PublicationType, string> = {
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
      router.push("/admin/publikasi");
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
          placeholder="Judul publikasi..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tipe <span className="text-red-500">*</span>
          </label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            {Object.entries(TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tanggal Publikasi
          </label>
          <input
            type="datetime-local"
            name="publishedAt"
            value={form.publishedAt}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Deskripsi
        </label>
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          rows={4}
          placeholder="Deskripsi publikasi..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            URL Eksternal
          </label>
          <input
            name="externalUrl"
            value={form.externalUrl ?? ""}
            onChange={handleChange}
            type="url"
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            URL File
          </label>
          <input
            name="fileUrl"
            value={form.fileUrl ?? ""}
            onChange={handleChange}
            type="url"
            placeholder="https://..."
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
              ? "Buat Publikasi"
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
