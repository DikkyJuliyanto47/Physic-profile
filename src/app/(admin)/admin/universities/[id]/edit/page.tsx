import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UniversityForm } from "@/components/admin/UniversityForm";

export const metadata = {
  title: "Edit Kampus - PSI Surabaya CMS",
};

export default async function EditUniversityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const university = await prisma.university.findUnique({
    where: { id },
  });

  if (!university) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Kampus</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui informasi {university.name}.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <UniversityForm mode="edit" initialData={university} />
      </div>
    </div>
  );
}
