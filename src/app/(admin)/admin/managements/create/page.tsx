import { ManagementPeriodForm } from "@/components/admin/ManagementPeriodForm";

export const metadata = {
  title: "Tambah Periode Kepengurusan - PSI Cabang Surabaya",
};

export default function CreateManagementPeriodPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Tambah Periode</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tambahkan periode baru untuk struktur kepengurusan.
        </p>
      </div>

      <section className="rounded-lg border border-neutral-200 bg-white p-6 shadow-card">
        <div className="mb-5 border-b border-neutral-200 pb-4">
          <h2 className="text-base font-semibold text-neutral-900">Informasi Periode</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Tentukan nama periode yang akan digunakan.
          </p>
        </div>

        <ManagementPeriodForm mode="create" />
      </section>
    </div>
  );
}