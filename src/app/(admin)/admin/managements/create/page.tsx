import { ManagementPeriodForm } from "@/components/admin/ManagementPeriodForm";

export const metadata = {
  title: "Tambah Periode Kepengurusan - PSI Surabaya CMS",
};

export default function CreateManagementPeriodPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tambah Periode</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tambah periode baru untuk struktur kepengurusan.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <ManagementPeriodForm mode="create" />
      </div>
    </div>
  );
}
