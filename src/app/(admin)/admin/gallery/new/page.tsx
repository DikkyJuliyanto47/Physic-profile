import { GalleryForm } from "@/components/admin/GalleryForm";

export const metadata = {
  title: "Tambah Media - PSI Cabang Surabaya",
};

export default function NewGalleryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Tambah Foto / Video
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Tambahkan media baru ke galeri dokumentasi PSI Surabaya.
        </p>
      </div>

      <div className="rounded-md border border-neutral-200 bg-white p-6 shadow-card">
        <GalleryForm mode="create" />
      </div>
    </div>
  );
}