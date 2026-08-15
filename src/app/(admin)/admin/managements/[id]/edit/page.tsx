import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ManagementPeriodForm } from "@/components/admin/ManagementPeriodForm";
import { ManagementPositionForm } from "@/components/admin/ManagementPositionForm";

export const metadata = {
  title: "Kelola Kepengurusan - PSI Surabaya CMS",
};

export default async function EditManagementPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ positionId?: string }>;
}) {
  const { id } = await params;
  const { positionId } = await searchParams;

  const [period, memberProfiles] = await Promise.all([
    prisma.managementPeriod.findUnique({
      where: { id },
      include: {
        positions: {
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          include: {
            memberProfile: {
              include: {
                user: { select: { name: true, email: true } },
                institution: { select: { id: true, name: true, shortName: true } },
              },
            },
          },
        },
      },
    }),
    prisma.memberProfile.findMany({
      orderBy: [{ user: { name: "asc" } }],
      include: {
        user: { select: { name: true, email: true } },
        institution: { select: { id: true, name: true, shortName: true } },
      },
    }),
  ]);

  if (!period) {
    notFound();
  }

  const selectedPosition = positionId
    ? period.positions.find((position) => position.id === positionId) ?? null
    : null;

  return (
    <div className="space-y-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kelola Periode</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Perbarui periode &ldquo;{period.period}&rdquo;.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
          <ManagementPeriodForm mode="edit" initialData={period} />
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              {selectedPosition ? "Edit Posisi" : "Tambah Posisi"}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">
              Pilih anggota yang sudah terdaftar dan atur jabatan, departemen, serta urutan.
            </p>
          </div>
          {selectedPosition && (
            <a
              href={`/admin/kepengurusan/${period.id}/edit`}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Batal Edit
            </a>
          )}
        </div>

        <ManagementPositionForm
          mode={selectedPosition ? "edit" : "create"}
          periodId={period.id}
          memberProfiles={memberProfiles.map((profile) => ({
            id: profile.id,
            user: profile.user,
            institution: profile.institution,
          }))}
          initialData={
            selectedPosition
              ? {
                  id: selectedPosition.id,
                  periodId: selectedPosition.periodId,
                  memberProfileId: selectedPosition.memberProfileId,
                  title: selectedPosition.title,
                  department: selectedPosition.department,
                  order: selectedPosition.order,
                }
              : undefined
          }
        />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Posisi Saat Ini</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-600">Anggota</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Jabatan</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Departemen</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Urutan</th>
                <th className="px-5 py-3 text-right font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {period.positions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-neutral-500">
                    Belum ada posisi untuk periode ini.
                  </td>
                </tr>
              ) : (
                period.positions.map((position) => (
                  <tr key={position.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50">
                    <td className="px-5 py-3">
                      {position.memberProfile ? (
                        <div>
                          <p className="font-medium text-neutral-900">
                            {position.memberProfile.user.name}
                          </p>
                          <p className="text-xs text-neutral-500">
                            {position.memberProfile.institution?.shortName ??
                              position.memberProfile.institution?.name ??
                              "-"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-neutral-900">{position.title}</td>
                    <td className="px-5 py-3 text-neutral-600">
                      {position.department ?? "-"}
                    </td>
                    <td className="px-5 py-3 text-neutral-600">{position.order}</td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`?positionId=${position.id}`}
                          className="rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          Edit
                        </a>
                        <form action={async () => {
                          "use server";
                          const { deleteManagementPosition } = await import("@/actions/kepengurusan");
                          await deleteManagementPosition(position.id);
                        }}>
                          <button
                            type="submit"
                            className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                          >
                            Hapus
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
