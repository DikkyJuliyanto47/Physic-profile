"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createMember,
  updateMember,
  type MemberInput,
  type ActionResponse,
} from "@/actions/member";

type UniversityOption = {
  id: string;
  name: string;
  shortName: string | null;
};

type Props = {
  mode: "create" | "edit";
  universities: UniversityOption[];
  initialData?: {
    id: string;
    name: string;
    email: string;
    memberProfile: {
      institutionId: string | null;
      fieldOfExpertise: string | null;
      photoUrl: string | null;
      detailUrl: string | null;
    } | null;
  };
};

export function MemberForm({ mode, universities, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialData?.memberProfile?.photoUrl ?? "");
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  const profile = initialData?.memberProfile;

  const [form, setForm] = useState<MemberInput>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    institutionId: profile?.institutionId ?? "",
    fieldOfExpertise: profile?.fieldOfExpertise ?? "",
    photoUrl: profile?.photoUrl ?? "",
    detailUrl: profile?.detailUrl ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
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
      result = await updateMember(initialData!.id, form);
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-neutral-900">
          Informasi Dasar
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Dr. John Doe"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="john@university.ac.id"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

        </div>
      </fieldset>

      {/* Universities */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-neutral-900">
          Perguruan Tinggi
        </legend>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Perguruan Tinggi
          </label>

          <select
            name="institutionId"
            value={form.institutionId ?? ""}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm"
          >
            <option value="">Pilih Kampus</option>

            {universities.map((uni) => (
              <option key={uni.id} value={uni.id}>
                {uni.shortName ? `${uni.shortName} - ${uni.name}` : uni.name}
              </option>
            ))}
          </select>
        </div>
      </fieldset>

      {/* Members Profile */}
      <fieldset>
      <legend className="mb-3 text-sm font-semibold text-neutral-900">
        Profil Anggota
      </legend>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Bidang
          </label>

          <input
            name="fieldOfExpertise"
            value={form.fieldOfExpertise ?? ""}
            onChange={handleChange}
            placeholder="Contoh: Fisika Material"
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            URL Detail Anggota
          </label>

          <input
            type="url"
            name="detailUrl"
            value={form.detailUrl ?? ""}
            onChange={handleChange}
            placeholder="https://..."
            className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm"
          />

          <p className="mt-1.5 text-xs text-neutral-500">
            Tautan menuju profil atau halaman detail anggota.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Gambar
          </label>

          <input 
            type="file"
            accept="image/png, image/jpg, image/webp"
            onChange={handleImageUpload}
            disabled={uploading}
            className="w-full rounded-lg border border-neutral-300 bg-white text-sm
              file:mr-4 file:rounded-md file:border-0
              file:bg-primary-600/10 file:px-4 file:py-2
              file:text-primary-700
              file:transition-colors
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
    </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Anggota"
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
