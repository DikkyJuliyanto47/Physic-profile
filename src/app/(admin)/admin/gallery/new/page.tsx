import { GalleryForm } from "@/components/admin/GalleryForm";

export const metadata = {
  title: "Tambah Media - PSI Surabaya CMS",
};

export default function NewGalleryPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">
          Tambah Foto / Video
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Unggah media baru ke galeri dokumentasi.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <GalleryForm mode="create" />
      </div>
    </div>
  );
}
