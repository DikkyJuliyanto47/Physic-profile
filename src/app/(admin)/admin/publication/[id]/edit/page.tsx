import { requireAdmin } from "@/lib/auth-utils";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PublicationForm } from "@/components/admin/PublicationForm";

export const metadata = {
  title: "Edit Publikasi - PSI Cabang Surabaya",
};

export default async function EditPublicationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  if (!session) notFound();
  const { id } = await params;

  const publication = await prisma.publication.findUnique({
    include: { author: { select: { name: true, email: true } } },
    where: { id, ...(session.user.role !== "SUPER_ADMIN" && { authorId: session.user.id }) },
  });

  if (!publication) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Edit Publikasi
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui &ldquo;{publication.title}&rdquo;.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <p className="mb-4 break-words text-sm text-neutral-500">
              Pengaju: {publication.author?.name ?? "Belum diketahui"}
              {publication.author?.email ? ` (${publication.author.email})` : ""}
            </p>
            <PublicationForm key={publication.contentVersion} mode="edit" initialData={publication} />
      </div>
    </div>
  );
}