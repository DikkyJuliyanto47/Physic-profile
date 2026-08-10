import { prisma } from "@/lib/prisma";
import { MemberForm } from "@/components/admin/MemberForm";

export const metadata = {
  title: "Tambah Anggota Baru - PSI Surabaya CMS",
};

export default async function NewMemberPage() {
  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, shortName: true },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tambah Anggota Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Daftarkan anggota atau pengurus baru.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <MemberForm mode="create" universities={universities} />
      </div>
    </div>
  );
}
