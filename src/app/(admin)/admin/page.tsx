import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const STAT_CARDS = [
  {
    label: "Berita",
    key: "berita",
    href: "/admin/news",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  },
  {
    label: "Agenda",
    key: "agenda",
    href: "/admin/events",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "Anggota",
    key: "anggota",
    href: "/admin/members",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    label: "Perguruan Tinggi",
    key: "kampus",
    href: "/admin/universities",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  },
];

const ADMIN_MODULES = [
  {
    label: "Sumber Daya",
    description: "Dokumen dan sumber akademik",
    href: "/admin/documents",
  },
  {
    label: "Kepengurusan",
    description: "Struktur dan data pengurus",
    href: "/admin/managements",
  },
  {
    label: "Riset & Publikasi",
    description: "Publikasi dan hasil riset",
    href: "/admin/publication",
  },
  {
    label: "Galeri",
    description: "Dokumentasi visual PSI",
    href: "/admin/gallery",
  },
  {
    label: "Pesan",
    description: "Pesan dan komunikasi masuk",
    href: "/admin/messages",
  },
];

const QUICK_ACTIONS = [
  {
    label: "Tambah Berita",
    href: "/admin/news/new",
    icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Tambah Agenda",
    href: "/admin/events/new",
    icon: "M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    label: "Kelola Kampus",
    href: "/admin/universities",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
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
        include: {
          _count: {
            select: {
              members: true,
            },
          },
        },
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
      <div className="mx-auto w-full max-w-360 space-y-7">
        <header>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600">
            Overview
          </p>

          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-[28px]">
            Dashboard
          </h1>

          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
            Ringkasan pengelolaan konten dan administrasi Physical Society of
            Indonesia Cabang Surabaya.
          </p>
        </header>

        <section aria-label="Statistik utama">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className="group rounded-lg border border-neutral-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                    <svg
                      className="h-4.5 w-4.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={card.icon}
                      />
                    </svg>
                  </div>

                  <svg
                    className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-5-5 5 5-5 5"
                    />
                  </svg>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-neutral-500">
                    {card.label}
                  </p>

                  <p className="mt-1 text-[30px] font-bold leading-none tracking-tight text-neutral-900">
                    {counts[card.key]}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="quick-actions-title">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2
                id="quick-actions-title"
                className="text-base font-semibold tracking-tight text-neutral-900"
              >
                Akses Cepat
              </h2>

              <p className="mt-0.5 text-xs text-neutral-500">
                Tindakan yang sering digunakan.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="inline-flex h-10 items-center gap-2 rounded-md border border-neutral-200 bg-white px-3.5 text-sm font-medium text-neutral-700 transition-colors hover:border-primary-200 hover:bg-primary-50 hover:text-primary-700"
              >
                <svg
                  className="h-4 w-4 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.7}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={action.icon}
                  />
                </svg>

                {action.label}
              </Link>
            ))}
          </div>
        </section>

        <section aria-labelledby="modules-title">
          <div className="mb-3">
            <h2
              id="modules-title"
              className="text-base font-semibold tracking-tight text-neutral-900"
            >
              Modul Administrasi
            </h2>

            <p className="mt-0.5 text-xs text-neutral-500">
              Akses seluruh area pengelolaan PSI Surabaya.
            </p>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
            <div className="divide-y divide-neutral-100">
              {ADMIN_MODULES.map((module) => (
                <Link
                  key={module.href}
                  href={module.href}
                  className="group flex items-center justify-between gap-4 px-4 py-3.5 transition-colors hover:bg-neutral-50 sm:px-5"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700">
                      {module.label}
                    </p>

                    <p className="mt-0.5 truncate text-xs text-neutral-500">
                      {module.description}
                    </p>
                  </div>

                  <svg
                    className="h-4 w-4 shrink-0 text-neutral-300 transition-colors group-hover:text-primary-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.8}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12h14m-5-5 5 5-5 5"
                    />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="campus-list-title"
          className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card"
        >
          <div className="flex flex-col gap-2 border-b border-neutral-100 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2
                id="campus-list-title"
                className="text-base font-semibold tracking-tight text-neutral-900"
              >
                Daftar Kampus Anggota
              </h2>

              <p className="mt-0.5 text-xs text-neutral-500">
                Lima kampus pertama berdasarkan nama.
              </p>
            </div>

            <Link
              href="/admin/universities"
              className="w-fit text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
            >
              Lihat Semua
              <span className="ml-1">→</span>
            </Link>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-140 text-left text-sm">
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
                      className="px-4 py-9 text-center text-sm text-neutral-500 sm:px-5"
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
                        <span className="font-medium text-primary-700">
                          {kampus._count.members}
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
