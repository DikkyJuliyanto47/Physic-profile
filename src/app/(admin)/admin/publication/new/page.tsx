import { PublicationForm } from "@/components/admin/PublicationForm";

export const metadata = {
  title: "Tambah Publikasi Baru - PSI Surabaya CMS",
};

export default function NewPublicationPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Tambah Publikasi Baru
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Buat publikasi, jurnal, buku, atau HKI baru.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <PublicationForm mode="create" />
      </div>
    </div>
  );
}
