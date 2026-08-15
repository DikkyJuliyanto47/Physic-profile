import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ManagementActions } from "./ManagementActions";
import { ManagementPositionActions } from "./ManagementPositionActions";

export const dynamic = "force-dynamic";

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
                user: { select: { name: true, email: true } },
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
    }),
  ]);

  const selectedPeriod = activePeriod ?? periods[0] ?? null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Kepengurusan</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola periode dan posisi kepengurusan PSI Surabaya.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin/kepengurusan/create"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tambah Periode
          </Link>
        </div>
      </div>

      {selectedPeriod ? (
        <div className="rounded-xl border border-primary-200 bg-primary-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-primary-700">
            Periode Aktif
          </p>
          <h2 className="mt-1 text-xl font-bold text-primary-900">{selectedPeriod.period}</h2>
          <p className="mt-1 text-sm text-primary-700">
            Diaktifkan sejak {formatDate(selectedPeriod.createdAt)}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-200 bg-white p-4 text-sm text-neutral-500">
          Belum ada periode aktif.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
        <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
          <div className="border-b border-neutral-200 px-5 py-4">
            <h2 className="text-lg font-semibold text-neutral-900">Daftar Periode</h2>
          </div>

          <div className="divide-y divide-neutral-100">
            {periods.length === 0 ? (
              <div className="px-5 py-8 text-sm text-neutral-500">Belum ada periode.</div>
            ) : (
              periods.map((period) => (
                <div key={period.id} className="px-5 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-neutral-900">{period.period}</p>
                        {period.isActive && (
                          <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
                            Aktif
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        {period.positions.length} posisi • {formatDate(period.createdAt)}
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
              ))
            )}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-200 px-5 py-4">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Posisi Periode</h2>
              <p className="text-sm text-neutral-500">
                {selectedPeriod ? selectedPeriod.period : "Belum ada periode dipilih"}
              </p>
            </div>
            {selectedPeriod && (
              <Link
                href={`/admin/kepengurusan/${selectedPeriod.id}/edit`}
                className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Kelola Posisi
              </Link>
            )}
          </div>

          {!selectedPeriod ? (
            <div className="px-5 py-8 text-sm text-neutral-500">
              Buat periode terlebih dahulu untuk menambahkan posisi.
            </div>
          ) : (
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
                  {selectedPeriod.positions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-neutral-500">
                        Belum ada posisi untuk periode ini.
                      </td>
                    </tr>
                  ) : (
                    selectedPeriod.positions.map((position) => (
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
                          <ManagementPositionActions
                            positionId={position.id}
                            positionTitle={position.title}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
