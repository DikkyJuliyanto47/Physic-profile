import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kepengurusan | PSI Surabaya",
  description: "Struktur kepengurusan Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

export default async function KepengurusanPage() {
  const activePeriod = await prisma.managementPeriod.findFirst({
    where: { isActive: true },
    include: {
      positions: {
        orderBy: { order: "asc" },
        include: {
          memberProfile: {
            select: {
              id: true,
              photoUrl: true,
              position: true,
              fieldOfExpertise: true,
              user: { select: { name: true } },
              institution: { select: { name: true, shortName: true } },
            },
          },
        },
      },
    },
  });

  const allPeriods = await prisma.managementPeriod.findMany({
    orderBy: { period: "desc" },
    select: { id: true, period: true, isActive: true },
  });

  const departments = activePeriod
    ? [...new Set(activePeriod.positions.map((p) => p.department).filter(Boolean))]
    : [];

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Kepengurusan</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Struktur kepengurusan PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Period Tabs */}
        {allPeriods.length > 0 && (
          <div className="mb-8 flex flex-wrap gap-2">
            {allPeriods.map((p) => (
              <span
                key={p.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ${
                  p.isActive
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-neutral-200 text-neutral-500"
                }`}
              >
                Periode {p.period}
                {p.isActive && <span className="text-xs text-primary-200">(Aktif)</span>}
              </span>
            ))}
          </div>
        )}

        {!activePeriod ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada periode kepengurusan aktif.</p>
          </div>
        ) : (
          <>
            {/* By Department */}
            {departments.length > 0 ? (
              departments.map((dept) => {
                const deptPositions = activePeriod!.positions.filter(
                  (p) => p.department === dept
                );
                return (
                  <div key={dept} className="mb-10">
                    <h2 className="mb-5 text-xl font-bold text-neutral-900">{dept}</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {deptPositions.map((pos) => (
                        <div
                          key={pos.id}
                          className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
                        >
                          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                            {pos.memberProfile?.photoUrl ? (
                              <img
                                src={pos.memberProfile.photoUrl}
                                alt=""
                                className="h-14 w-14 rounded-full object-cover"
                              />
                            ) : pos.memberProfile ? (
                              pos.memberProfile.user.name.charAt(0)
                            ) : (
                              <span className="text-neutral-400">?</span>
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate font-semibold text-neutral-900">
                              {pos.memberProfile?.user.name ?? "Belum diisi"}
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-primary-600">
                              {pos.title}
                            </p>
                            {pos.memberProfile?.institution && (
                              <p className="mt-0.5 truncate text-xs text-neutral-400">
                                {pos.memberProfile.institution.shortName ?? pos.memberProfile.institution.name}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {activePeriod!.positions.map((pos) => (
                  <div
                    key={pos.id}
                    className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card"
                  >
                    <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                      {pos.memberProfile?.photoUrl ? (
                        <img src={pos.memberProfile.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                      ) : pos.memberProfile ? (
                        pos.memberProfile.user.name.charAt(0)
                      ) : (
                        <span className="text-neutral-400">?</span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-neutral-900">
                        {pos.memberProfile?.user.name ?? "Belum diisi"}
                      </p>
                      <p className="mt-0.5 text-sm font-medium text-primary-600">{pos.title}</p>
                      {pos.memberProfile?.institution && (
                        <p className="mt-0.5 truncate text-xs text-neutral-400">
                          {pos.memberProfile.institution.shortName ?? pos.memberProfile.institution.name}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
