import { PublicationForm } from "@/components/admin/PublicationForm";

export const metadata = {
  title: "Tambah Publikasi Baru - PSI Cabang Surabaya",
};

export default function NewPublicationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Tambah Publikasi Baru
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Buat publikasi, jurnal, buku, atau HKI baru.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <PublicationForm mode="create" />
      </div>
    </div>
  );
}