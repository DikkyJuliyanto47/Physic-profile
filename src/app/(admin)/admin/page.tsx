import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STAT_CARDS = [
  {
    label: "Total Berita",
    key: "berita",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
    color: "text-blue-600",
    iconBg: "bg-blue-100",
  },
  {
    label: "Total Agenda",
    key: "agenda",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
    color: "text-emerald-600",
    iconBg: "bg-emerald-100",
  },
  {
    label: "Anggota Terdaftar",
    key: "anggota",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
    color: "text-violet-600",
    iconBg: "bg-violet-100",
  },
  {
    label: "Kampus Anggota",
    key: "kampus",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
    color: "text-amber-600",
    iconBg: "bg-amber-100",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Tambah Berita Baru",
    href: "/admin/news/new",
    icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
    color: "bg-primary-600 text-white hover:bg-primary-700",
  },
  {
    label: "Tambah Agenda",
    href: "/admin/events/new",
    icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
    color:
      "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50",
  },
  {
    label: "Kelola Kampus",
    href: "/admin/universities",
    icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924-1.756-3.35 0a1.724 1.724 0 00-2.573 1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    color:
      "border border-primary-200 bg-white text-primary-700 hover:bg-primary-50",
  },
];

export default async function AdminDashboardPage() {
  const [totalBerita, totalAgenda, totalAnggota, totalKampus, kampusList] =
    await Promise.all([
      prisma.news.count(),
      prisma.event.count(),
      prisma.user.count(),
      prisma.university.count(),
      prisma.university.findMany({
        take: 5,
        orderBy: { name: "asc" },
        include: { _count: { select: { members: true } } },
      }),
    ]);

  const counts: Record<string, number> = {
    berita: totalBerita,
    agenda: totalAgenda,
    anggota: totalAnggota,
    kampus: totalKampus,
  };

  return (
    <main className="w-full min-w-0">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 sm:space-y-8">
        <header className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
            Selamat datang di panel administrasi PSI Surabaya.
          </p>
        </header>

        <section
          aria-label="Statistik"
          className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4"
        >
          {STAT_CARDS.map((card) => (
            <div
              key={card.key}
              className="rounded-lg border border-neutral-200 bg-white p-4 shadow-card sm:p-5"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-md ${card.iconBg}`}
                >
                  <svg
                    className={`h-5 w-5 ${card.color}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d={card.icon}
                    />
                  </svg>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-neutral-500">
                    {card.label}
                  </p>
                  <p className="mt-0.5 text-2xl font-bold leading-none tracking-tight text-neutral-900">
                    {counts[card.key]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section aria-labelledby="quick-actions-title">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <h2
              id="quick-actions-title"
              className="text-base font-semibold tracking-tight text-neutral-900 sm:text-lg"
            >
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:flex sm:flex-wrap sm:gap-3">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold transition-colors ${action.color}`}
              >
                <svg
                  className="h-4 w-4 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={action.icon}
                  />
                </svg>
                <span>{action.label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="campus-list-title"
          className="min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card"
        >
          <div className="flex flex-col gap-2 border-b border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <h2
              id="campus-list-title"
              className="text-base font-semibold tracking-tight text-neutral-900 sm:text-lg"
            >
              Daftar Kampus Anggota
            </h2>

            <Link
              href="/admin/universities"
              className="w-fit text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Lihat Semua →
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-160 text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="px-4 py-3 font-medium text-neutral-600 sm:px-5">
                    Nama Kampus
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 sm:px-5">
                    Singkatan
                  </th>
                  <th className="px-4 py-3 font-medium text-neutral-600 sm:px-5">
                    Anggota
                  </th>
                </tr>
              </thead>

              <tbody>
                {kampusList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-4 py-8 text-center text-neutral-500 sm:px-5"
                    >
                      Belum ada data kampus.
                    </td>
                  </tr>
                ) : (
                  kampusList.map((kampus) => (
                    <tr
                      key={kampus.id}
                      className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                    >
                      <td className="px-4 py-3.5 font-medium text-neutral-900 sm:px-5">
                        {kampus.name}
                      </td>
                      <td className="px-4 py-3.5 text-neutral-600 sm:px-5">
                        {kampus.shortName ?? "-"}
                      </td>
                      <td className="px-4 py-3.5 sm:px-5">
                        <span className="inline-flex items-center rounded-md bg-primary-50 px-2 py-1 text-xs font-medium text-primary-700">
                          {kampus._count.members} anggota
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}