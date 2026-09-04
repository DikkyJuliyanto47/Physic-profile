import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ManagementActions } from "@/components/ui/actions/ManagementActions";
import { ManagementPositionActions } from "@/components/ui/actions/ManagementPositionActions";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function ManagementPage() {
  const [periods, activePeriod] = await Promise.all([
    prisma.managementPeriod.findMany({
      orderBy: [{ isActive: "desc" }, { createdAt: "desc" }],
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
    prisma.managementPeriod.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
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
  ]);

  const selectedPeriod = activePeriod ?? periods[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Kepengurusan</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola periode dan struktur kepengurusan Physical Society of Indonesia Cabang Surabaya.
          </p>
        </div>

        <Link
          href="/admin/managements/create"
          className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary-600 px-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tambah Periode
        </Link>
      </div>

      {selectedPeriod ? (
        <div className="border-l-4 border-primary-600 bg-primary-50/60 px-4 py-3.5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-700">
                Periode Aktif
              </p>
              <p className="mt-0.5 text-base font-semibold text-primary-950">
                {selectedPeriod.period}
              </p>
            </div>
            <p className="text-xs text-primary-700">
              Diaktifkan sejak {formatDate(selectedPeriod.createdAt)}
            </p>
          </div>
        </div>
      ) : (
        <div className="border border-neutral-200 bg-white px-4 py-3.5 text-sm text-neutral-500">
          Belum ada periode kepengurusan.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-base font-semibold text-neutral-900">Daftar Periode</h2>
            <p className="mt-0.5 text-xs text-neutral-500">Riwayat periode kepengurusan.</p>
          </div>

          {periods.length === 0 ? (
            <div className="px-5 py-10 text-center text-sm text-neutral-500">
              Belum ada periode.
            </div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {periods.map((period) => (
                <div
                  key={period.id}
                  className={`px-5 py-4 transition-colors ${
                    period.isActive ? "bg-primary-50/40" : "hover:bg-neutral-50/70"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-neutral-900">
                          {period.period}
                        </p>

                        {period.isActive && (
                          <span className="inline-flex shrink-0 items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-semibold text-green-700">
                            Aktif
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-xs text-neutral-500">
                        {period.positions.length} posisi · {formatDate(period.createdAt)}
                      </p>
                    </div>

                    <ManagementActions
                      periodId={period.id}
                      periodName={period.period}
                      isActive={period.isActive}
                      positionCount={period.positions.length}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
          <div className="flex flex-col gap-3 border-b border-neutral-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-base font-semibold text-neutral-900">Struktur Kepengurusan</h2>
              <p className="mt-0.5 text-xs text-neutral-500">
                {selectedPeriod ? selectedPeriod.period : "Belum ada periode dipilih"}
              </p>
            </div>

            {selectedPeriod && (
              <Link
                href={`/admin/managements/${selectedPeriod.id}/edit`}
                className="inline-flex h-8 items-center justify-center rounded-md border border-neutral-300 bg-white px-3 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Kelola Posisi
              </Link>
            )}
          </div>

          {!selectedPeriod ? (
            <div className="px-5 py-10 text-center text-sm text-neutral-500">
              Buat periode terlebih dahulu untuk menambahkan posisi.
            </div>
          ) : selectedPeriod.positions.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <p className="text-sm font-medium text-neutral-700">
                Belum ada posisi kepengurusan.
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Tambahkan posisi untuk mulai membangun struktur kepengurusan.
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
                  {selectedPeriod.positions.map((position) => (
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

                      <td className="px-5 py-3.5 text-right">
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
    </div>
  );
}