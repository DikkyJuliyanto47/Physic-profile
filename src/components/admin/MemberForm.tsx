"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createMember,
  updateMember,
  type ActionResponse,
  type MemberInput,
} from "@/actions/member";

type UniversityOption = {
  id: string;
  name: string;
  shortName: string | null;
};

type MemberInitialData = {
  id: string;
  name: string;
  email: string;
  institutionId: string | null;
  fieldOfExpertise: string | null;
  photoUrl: string | null;
  detailUrl: string | null;
};

type Props =
  | {
      mode: "create";
      universities: UniversityOption[];
      initialData?: never;
    }
  | {
      mode: "edit";
      universities: UniversityOption[];
      initialData: MemberInitialData;
    };

const inputClass =
  "w-full rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100";

const labelClass = "mb-1.5 block text-sm font-medium text-neutral-700";

export function MemberForm({ mode, universities, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.photoUrl ?? "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState<MemberInput>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    institutionId: initialData?.institutionId ?? "",
    fieldOfExpertise: initialData?.fieldOfExpertise ?? "",
    photoUrl: initialData?.photoUrl ?? "",
    detailUrl: initialData?.detailUrl ?? "",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setError("");

    if (file.size > 1 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 1 MB.");
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
        photoUrl: data.url,
      }));
    } catch {
      setError("Terjadi kesalahan saat upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createMember(form);
    } else {
      result = await updateMember(initialData.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/members");
      router.refresh();
    } else {
      setError(result.error ?? "Terjadi kesalahan.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <fieldset className="space-y-4">
        <legend className="text-sm font-semibold text-neutral-900">
          Informasi Dasar
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Dr. John Doe"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@university.ac.id"
              className={inputClass}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="border-t border-neutral-100 pt-7">
        <legend className="text-sm font-semibold text-neutral-900">
          Perguruan Tinggi
        </legend>

        <div className="mt-4">
          <label htmlFor="institutionId" className={labelClass}>
            Perguruan Tinggi
          </label>

          <select
            id="institutionId"
            name="institutionId"
            value={form.institutionId ?? ""}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Pilih perguruan tinggi</option>
            {universities.map((university) => (
              <option key={university.id} value={university.id}>
                {university.shortName
                  ? `${university.shortName} — ${university.name}`
                  : university.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      <fieldset className="border-t border-neutral-100 pt-7">
        <legend className="text-sm font-semibold text-neutral-900">
          Profil Anggota
        </legend>

        <div className="mt-4 space-y-5">
          <div>
            <label htmlFor="fieldOfExpertise" className={labelClass}>
              Bidang Keahlian
            </label>
            <input
              id="fieldOfExpertise"
              name="fieldOfExpertise"
              value={form.fieldOfExpertise ?? ""}
              onChange={handleChange}
              placeholder="Contoh: Fisika Material"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="detailUrl" className={labelClass}>
              URL Detail Anggota
            </label>
            <input
              id="detailUrl"
              type="url"
              name="detailUrl"
              value={form.detailUrl ?? ""}
              onChange={handleChange}
              placeholder="https://..."
              className={inputClass}
            />
            <p className="mt-1.5 text-xs text-neutral-500">
              Tautan menuju profil atau halaman detail anggota.
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Gambar
            </label>

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
      </fieldset>

      <div className="flex flex-col-reverse gap-2 border-t border-neutral-100 pt-6 sm:flex-row sm:items-center">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={isSubmitting}
          className="rounded-md border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
        >
          Batal
        </button>

        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="rounded-md bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Anggota"
              : "Simpan Perubahan"}
        </button>
      </div>
    </form>
  );
}