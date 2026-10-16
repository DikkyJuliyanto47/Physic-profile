"use client";

import type { ContentVersion } from "@/lib/content-workflow";

import { useId, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createManagementPosition,
  updateManagementPosition,
  type ActionResponse,
} from "@/actions/management";

type MemberOption = {
  id: string;
  name: string;
  institution?: { name: string; shortName?: string | null } | null;
};

type Props = {
  expectedVersion?: ContentVersion;
  mode: "create" | "edit";
  periodId: string;
  memberProfiles: MemberOption[];
  initialData?: {
    id: string;
    periodId: string;
    memberProfileId: string | null;
    title: string;
    department: string | null;
    order: number;
  };
};

export function ManagementPositionForm({
  expectedVersion,
  mode,
  periodId,
  memberProfiles,
  initialData,
}: Props) {
  const [draftVersion] = useState(expectedVersion);
  const formId = useId();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    memberProfileId: initialData?.memberProfileId ?? "",
    title: initialData?.title ?? "",
    department: initialData?.department ?? "",
    order: String(initialData?.order ?? 0),
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      const orderNumber = Number(form.order);
      
      const payload = {
        periodId,
        memberProfileId: form.memberProfileId || null,
        title: form.title,
        department: form.department,
        order: orderNumber,
      };

      const result: ActionResponse =
        mode === "create"
          ? await createManagementPosition(payload)
          : await updateManagementPosition(initialData!.id, payload, draftVersion!);

      if (!result.success) {
        setError(result.error ?? "Terjadi kesalahan.");
        return;
      }

      router.push(result.pending ? "/admin/submissions?result=submitted" : `/admin/managements/${periodId}/edit`);
      router.refresh();
    } catch (error) {
      console.error("[ManagementPositionForm] Submit gagal:", error);
      setError(
      "Koneksi atau layanan bermasalah. Periksa daftar jabatan sebelum mencoba menyimpan kembali."
    );

      } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label htmlFor={`${formId}-memberProfileId`} className="mb-1.5 block text-sm font-medium text-neutral-700">
            Anggota <span className="text-neutral-400">(opsional)</span>
          </label>

          <select
            id={`${formId}-memberProfileId`}
            value={form.memberProfileId}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, memberProfileId: e.target.value }))
            }
            className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          >
            <option value="">Tanpa anggota</option>
            {memberProfiles.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name}
                {member.institution
                  ? ` - ${member.institution.shortName ?? member.institution.name}`
                  : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor={`${formId}-title`} className="mb-1.5 block text-sm font-medium text-neutral-700">
            Jabatan <span className="text-red-500">*</span>
          </label>

          <input
            id={`${formId}-title`}
            value={form.title}
            onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
            required
            placeholder="Ketua Umum"
            className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-department`} className="mb-1.5 block text-sm font-medium text-neutral-700">
            Departemen
          </label>

          <input
            id={`${formId}-department`}
            value={form.department}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, department: e.target.value }))
            }
            placeholder="Bidang Organisasi"
            className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div>
          <label htmlFor={`${formId}-order`} className="mb-1.5 block text-sm font-medium text-neutral-700">
            Urutan <span className="text-red-500">*</span>
          </label>

          <input
            id={`${formId}-order`}
            type="number"
            value={form.order}
            onChange={(e) => setForm((prev) => ({ ...prev, order: e.target.value }))}
            min={0}
            required
            className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 rounded-md bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Tambah Posisi"
              : "Simpan Posisi"}
        </button>

        <button
          type="button"
          onClick={() => router.push(`/admin/managements/${periodId}/edit`)}
          className="h-10 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
