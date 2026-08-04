import { DocumentForm } from "@/components/admin/DocumentForm";

export const metadata = {
  title: "Tambah Dokumen Baru - PSI Surabaya CMS",
};

export default function NewDocumentPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tambah Dokumen Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Unggah dokumen atau sumber daya baru.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <DocumentForm mode="create" />
      </div>
    </div>
  );
}
