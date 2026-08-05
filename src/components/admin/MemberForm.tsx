"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/generated/prisma/client";
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
    role: Role;
    isActive: boolean;
    memberProfile: {
      institutionId: string | null;
      position: string | null;
      nidn: string | null;
      fieldOfExpertise: string | null;
      emailPublic: string | null;
      photoUrl: string | null;
      googleScholarUrl: string | null;
      scopusUrl: string | null;
      orcidUrl: string | null;
    } | null;
  };
};

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MEMBER: "Anggota",
};

export function MemberForm({ mode, universities, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const profile = initialData?.memberProfile;

  const [form, setForm] = useState<MemberInput>({
    name: initialData?.name ?? "",
    email: initialData?.email ?? "",
    password: "",
    role: initialData?.role ?? "MEMBER",
    isActive: initialData?.isActive ?? true,
    institutionId: profile?.institutionId ?? "",
    position: profile?.position ?? "",
    nidn: profile?.nidn ?? "",
    fieldOfExpertise: profile?.fieldOfExpertise ?? "",
    emailPublic: profile?.emailPublic ?? "",
    photoUrl: profile?.photoUrl ?? "",
    googleScholarUrl: profile?.googleScholarUrl ?? "",
    scopusUrl: profile?.scopusUrl ?? "",
    orcidUrl: profile?.orcidUrl ?? "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
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

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Password {mode === "create" && <span className="text-red-500">*</span>}
            </label>
            <input
              type="password"
              name="password"
              value={form.password ?? ""}
              onChange={handleChange}
              required={mode === "create"}
              placeholder={mode === "edit" ? "Kosongkan jika tidak diubah" : "Minimal 6 karakter"}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              Akun Aktif
            </label>
          </div>
        </div>
      </fieldset>

      {/* Organization Info */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-neutral-900">
          Informasi Organisasi
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              {Object.entries(ROLE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Perguruan Tinggi
            </label>
            <select
              name="institutionId"
              value={form.institutionId ?? ""}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Pilih Kampus</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.shortName ? `${uni.shortName} - ${uni.name}` : uni.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Jabatan / Posisi
            </label>
            <input
              name="position"
              value={form.position ?? ""}
              onChange={handleChange}
              placeholder="Ketua Pengurus, Anggota..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </fieldset>

      {/* Academic Info */}
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-neutral-900">
          Informasi Akademik
        </legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              NIDN
            </label>
            <input
              name="nidn"
              value={form.nidn ?? ""}
              onChange={handleChange}
              placeholder="0000000000"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Bidang Keahlian
            </label>
            <input
              name="fieldOfExpertise"
              value={form.fieldOfExpertise ?? ""}
              onChange={handleChange}
              placeholder="Fisika Material, Optika..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Email Publik
            </label>
            <input
              type="email"
              name="emailPublic"
              value={form.emailPublic ?? ""}
              onChange={handleChange}
              placeholder="public@email.com"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div className="sm:col-span-3">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              URL Avatar
            </label>
            <input
              name="photoUrl"
              value={form.photoUrl ?? ""}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Google Scholar URL
            </label>
            <input
              name="googleScholarUrl"
              value={form.googleScholarUrl ?? ""}
              onChange={handleChange}
              placeholder="https://scholar.google.com/..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Scopus URL
            </label>
            <input
              name="scopusUrl"
              value={form.scopusUrl ?? ""}
              onChange={handleChange}
              placeholder="https://www.scopus.com/..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              ORCID URL
            </label>
            <input
              name="orcidUrl"
              value={form.orcidUrl ?? ""}
              onChange={handleChange}
              placeholder="https://orcid.org/..."
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>
        </div>
      </fieldset>

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
