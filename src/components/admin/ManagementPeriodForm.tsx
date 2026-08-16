"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  createManagementPeriod,
  updateManagementPeriod,
  type ActionResponse,
  type ManagementPeriodInput,
} from "@/actions/kepengurusan";

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
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          Periode <span className="text-red-500">*</span>
        </label>
        <input
          name="period"
          value={form.period}
          onChange={(e) => setForm((prev) => ({ ...prev, period: e.target.value }))}
          placeholder="2025/2026"
          required
          className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        />
      </div>

      <label className="flex items-center gap-3 rounded-lg border border-neutral-200 px-4 py-3 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={form.isActive}
          onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
          className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
        />
        Jadikan periode aktif
      </label>

      <div className="flex items-center gap-3 border-t border-neutral-200 pt-5">
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
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
          className="rounded-lg border border-neutral-300 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
