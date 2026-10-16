import { contentVersion, contentVersions } from "@/lib/content-approval";
import { canManageContent } from "@/lib/content-approval";
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
  const versions = await contentVersions(["publication"]);
  const { id } = await params;
  if (!await canManageContent("publication", id, session.user)) notFound();

  const publication = await prisma.publication.findUnique({
    where: { id },
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
        <PublicationForm expectedVersion={contentVersion("publication", publication, versions)} mode="edit" initialData={publication} />
      </div>
    </div>
  );
}
