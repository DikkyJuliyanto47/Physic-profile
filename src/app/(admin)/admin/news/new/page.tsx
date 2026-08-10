import { NewsForm } from "@/components/admin/NewsForm";

export const metadata = {
  title: "Tambah Berita Baru - PSI Surabaya CMS",
};

export default function NewNewsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tambah Berita Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Buat berita atau pengumuman baru.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <NewsForm mode="create" />
      </div>
    </div>
  );
}
