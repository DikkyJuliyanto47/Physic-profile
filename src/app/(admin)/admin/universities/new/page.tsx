import { UniversityForm } from "@/components/admin/UniversityForm";

export const metadata = {
  title: "Tambah Kampus Baru - PSI Surabaya CMS",
};

export default function NewUniversityPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Tambah Kampus Baru
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tambahkan perguruan tinggi baru ke dalam sistem.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <UniversityForm mode="create" />
      </div>
    </div>
  );
}
