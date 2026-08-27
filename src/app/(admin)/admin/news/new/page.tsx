import { NewsForm } from "@/components/admin/NewsForm";

export const metadata = {
  title: "Tambah Berita Baru - PSI Cabang Surabaya",
};

export default function NewNewsPage() {
  return (
    <div className="w-full min-w-0">
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8">
        <header>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Tambah Berita Baru
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
            Buat berita atau pengumuman baru untuk PSI Surabaya.
          </p>
        </header>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
          <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-neutral-900">
              Informasi Berita
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Lengkapi informasi sebelum menerbitkan berita.
            </p>
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            <NewsForm mode="create" />
          </div>
        </div>
      </div>
    </div>
  );
}