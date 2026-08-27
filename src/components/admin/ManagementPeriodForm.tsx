"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createManagementPeriod,
  updateManagementPeriod,
  type ActionResponse,
  type ManagementPeriodInput,
} from "@/actions/management";

type Props = {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    period: string;
    isActive: boolean;
  };
};

export function ManagementPeriodForm({ mode, initialData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<ManagementPeriodInput>({
    period: initialData?.period ?? "",
    isActive: initialData?.isActive ?? false,
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    let result: ActionResponse;

    if (mode === "create") {
      result = await createManagementPeriod(form);
    } else {
      result = await updateManagementPeriod(initialData!.id, form);
    }

    setIsSubmitting(false);

    if (result.success) {
      router.push("/admin/managements");
      router.refresh();
      return;
    }

    setError(result.error ?? "Terjadi kesalahan.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="border-l-2 border-red-500 bg-red-50 px-3.5 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Periode <span className="text-red-500">*</span>
        </label>

        <input
          name="period"
          value={form.period}
          onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value }))}
          placeholder="2025/2026"
          required
          className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />

        <p className="mt-1.5 text-xs text-neutral-500">
          Gunakan format periode yang konsisten, misalnya 2025/2026.
        </p>
      </div>

      <label className="flex cursor-pointer items-start gap-3 border border-neutral-200 px-3.5 py-3 transition-colors hover:bg-neutral-50">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, isActive: e.target.checked }))
          }
          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />

        <span>
          <span className="block text-sm font-medium text-neutral-800">
            Jadikan periode aktif
          </span>
          <span className="mt-0.5 block text-xs leading-5 text-neutral-500">
            Periode ini akan digunakan sebagai struktur kepengurusan yang sedang berjalan.
          </span>
        </span>
      </label>

      <div className="flex items-center gap-2 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="h-9 rounded-md bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Menyimpan..."
            : mode === "create"
              ? "Buat Periode"
              : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="h-9 rounded-md border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}