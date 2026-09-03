import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ManagementPeriodForm } from "@/components/admin/ManagementPeriodForm";
import { ManagementPositionForm } from "@/components/admin/ManagementPositionForm";
import { ManagementPositionActions } from "../../ManagementPositionActions";

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
                institution: { select: { id: true, name: true, shortName: true } },
              },
            },
          },
        },
      },
    }),
    prisma.memberProfile.findMany({
      orderBy: { name: "asc" },
      include: {
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
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Link
          href="/admin/managements"
          className="mb-1 w-fit text-xs font-medium text-neutral-500 transition-colors hover:text-neutral-900"
        >
          ← Kembali ke Kepengurusan
        </Link>

        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Kelola Kepengurusan
        </h1>

        <p className="text-sm text-neutral-500">
          Kelola periode <span className="font-medium text-neutral-700">{period.period}</span>{" "}
          dan susunan posisi di dalamnya.
        </p>
      </div>

      <section className="mx-auto w-full max-w-3xl rounded-lg border border-neutral-200 bg-white shadow-card">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-base font-semibold text-neutral-900">Informasi Periode</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Perbarui informasi dasar periode kepengurusan.
          </p>
        </div>

        <div className="p-5">
          <ManagementPeriodForm mode="edit" initialData={period} />
        </div>
      </section>

      <section className="rounded-lg border border-neutral-200 bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-neutral-900">
              {selectedPosition ? "Edit Posisi" : "Tambah Posisi"}
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              Atur anggota, jabatan, departemen, dan urutan struktur.
            </p>
          </div>

          {selectedPosition && (
            <Link
              href={`/admin/managements/${period.id}/edit`}
              className="inline-flex h-8 items-center justify-center rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Batal Edit
            </Link>
          )}
        </div>

        <div className="p-5">
          <ManagementPositionForm
            mode={selectedPosition ? "edit" : "create"}
            periodId={period.id}
            memberProfiles={memberProfiles.map((profile) => ({
              id: profile.id,
              name: profile.name,
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
      </section>

      <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-base font-semibold text-neutral-900">Posisi Saat Ini</h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Daftar posisi yang telah dimasukkan ke periode ini.
          </p>
        </div>

        {period.positions.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm font-medium text-neutral-700">
              Belum ada posisi kepengurusan.
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              Gunakan form di atas untuk menambahkan posisi pertama.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/70">
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-600">Anggota</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-600">Jabatan</th>
                  <th className="px-5 py-3 text-xs font-semibold text-neutral-600">Departemen</th>
                  <th className="w-20 px-5 py-3 text-center text-xs font-semibold text-neutral-600">
                    Urutan
                  </th>
                  <th className="w-32 px-5 py-3 text-right text-xs font-semibold text-neutral-600">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {period.positions.map((position) => (
                  <tr
                    key={position.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60"
                  >
                    <td className="px-5 py-3.5">
                      {position.memberProfile ? (
                        <div>
                          <p className="font-medium text-neutral-900">
                            {position.memberProfile.name}
                          </p>
                          <p className="mt-0.5 text-xs text-neutral-500">
                            {position.memberProfile.institution?.shortName ??
                              position.memberProfile.institution?.name ??
                              "-"}
                          </p>
                        </div>
                      ) : (
                        <span className="text-neutral-400">Belum ditentukan</span>
                      )}
                    </td>

                    <td className="px-5 py-3.5 font-medium text-neutral-900">
                      {position.title}
                    </td>

                    <td className="px-5 py-3.5 text-neutral-600">
                      {position.department ?? "-"}
                    </td>

                    <td className="px-5 py-3.5 text-center text-neutral-600">
                      {position.order}
                    </td>

                    <td className="px-5 py-3.5">
                      <ManagementPositionActions
                        positionId={position.id}
                        positionTitle={position.title}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}