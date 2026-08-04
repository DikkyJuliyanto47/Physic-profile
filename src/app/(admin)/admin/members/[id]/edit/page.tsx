import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MemberForm } from "@/components/admin/MemberForm";

export const metadata = {
  title: "Edit Anggota - PSI Surabaya CMS",
};

export default async function EditMemberPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [user, universities] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: { memberProfile: true },
    }),
    prisma.university.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, shortName: true },
    }),
  ]);

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Edit Anggota</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui data &ldquo;{user.name}&rdquo;.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <MemberForm mode="edit" universities={universities} initialData={user} />
      </div>
    </div>
  );
}
