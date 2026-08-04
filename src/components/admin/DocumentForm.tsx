"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createDocument,
  updateDocument,
  type DocumentInput,
  type ActionResponse,
} from "@/actions/document";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    title: string;
    category: string;
    description: string | null;
    fileUrl: string;
    fileType: string | null;
    fileSize: string | null;
    isPublic: boolean;
  };
};

const CATEGORIES = [
  { value: "Kurikulum", label: "Kurikulum" },
  { value: "Akreditasi", label: "Akreditasi" },
  { value: "Panduan", label: "Panduan" },
  { value: "Template", label: "Form / Template" },
  { value: "Regulasi", label: "Regulasi" },
  { value: "Lainnya", label: "Lainnya" },
];

const FILE_TYPES = [
  { value: "PDF", label: "PDF" },
  { value: "DOCX", label: "DOCX" },
  { value: "XLSX", label: "XLSX" },
  { value: "PPTX", label: "PPTX" },
  { value: "JPG", label: "JPG" },
  { value: "PNG", label: "PNG" },
  { value: "Lainnya", label: "Lainnya" },
];

export function DocumentForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<DocumentInput>({
    title: initialData?.title ?? "",
    category: initialData?.category ?? "Panduan",
    description: initialData?.description ?? "",
    fileUrl: initialData?.fileUrl ?? "",
    fileType: initialData?.fileType ?? "",
    fileSize: initialData?.fileSize ?? "",
    isPublic: initialData?.isPublic ?? true,
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
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createDocument(form);
    } else {
      result = await updateDocument(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/documents");
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
          Judul Dokumen <span className="text-red-500">*</span>
        </label>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Judul dokumen..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Tipe File
          </label>
          <select
            name="fileType"
            value={form.fileType ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          >
            <option value="">Pilih Tipe</option>
            {FILE_TYPES.map((ft) => (
              <option key={ft.value} value={ft.value}>
                {ft.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Ukuran File
          </label>
          <input
            name="fileSize"
            value={form.fileSize ?? ""}
            onChange={handleChange}
            placeholder="2.4 MB"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          URL File <span className="text-red-500">*</span>
        </label>
        <input
          name="fileUrl"
          value={form.fileUrl}
          onChange={handleChange}
          required
          placeholder="https://storage.example.com/documents/file.pdf"
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
        <p className="mt-1 text-xs text-neutral-500">
          Link langsung ke file untuk diunduh.
        </p>
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Deskripsi
        </label>
        <textarea
          name="description"
          value={form.description ?? ""}
          onChange={handleChange}
          rows={3}
          placeholder="Deskripsi singkat dokumen..."
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            name="isPublic"
            checked={form.isPublic}
            onChange={handleChange}
            className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
          />
          Publik (Bisa diakses semua orang)
        </label>
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
              ? "Buat Dokumen"
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
