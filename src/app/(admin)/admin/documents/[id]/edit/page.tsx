import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DocumentForm } from "@/components/admin/DocumentForm";

export const metadata = {
  title: "Edit Dokumen - PSI Surabaya CMS",
};

export default async function EditDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const doc = await prisma.documentResource.findUnique({ where: { id } });

  if (!doc) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Dokumen</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui &ldquo;{doc.title}&rdquo;.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <DocumentForm mode="edit" initialData={doc} />
      </div>
    </div>
  );
}
