import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { MemberForm } from "@/components/admin/MemberForm";

export const metadata = {
  title: "Edit Anggota - PSI Cabang Surabaya",
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
    <div className="w-full min-w-0">
      <div className="mx-auto w-full max-w-4xl space-y-6 sm:space-y-8">
        <header>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Edit Anggota
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
            Perbarui data &ldquo;{user.name}&rdquo;.
          </p>
        </header>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
          <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-neutral-900">
              Informasi Anggota
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              Perbarui informasi anggota yang diperlukan.
            </p>
          </div>

          <div className="p-5 sm:p-6 lg:p-7">
            <MemberForm
              mode="edit"
              universities={universities}
              initialData={user}
            />
          </div>
        </div>
      </div>
    </div>
  );
}