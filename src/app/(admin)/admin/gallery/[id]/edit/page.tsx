import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { GalleryForm } from "@/components/admin/GalleryForm";

export const metadata = {
  title: "Edit Media - PSI Surabaya CMS",
};

export default async function EditGalleryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const item = await prisma.gallery.findUnique({ where: { id } });

  if (!item) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Media</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui &ldquo;{item.title}&rdquo;.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <GalleryForm mode="edit" initialData={item} />
      </div>
    </div>
  );
}
