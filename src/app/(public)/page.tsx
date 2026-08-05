import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ContentStatus } from "@/generated/prisma/client";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

const NEWS_CATEGORY_COLORS: Record<string, string> = {
  ORGANISASI: "bg-blue-100 text-blue-700",
  SEMINAR: "bg-purple-100 text-purple-700",
  WORKSHOP: "bg-orange-100 text-orange-700",
  PERTEMUAN_RUTIN: "bg-teal-100 text-teal-700",
  KERJASAMA: "bg-indigo-100 text-indigo-700",
  PRESTASI_ANGGOTA: "bg-amber-100 text-amber-700",
};

const NEWS_CATEGORY_LABELS: Record<string, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

export default async function HomePage() {
  const [totalKampus, totalAnggota, totalBerita, totalAgenda, latestNews, upcomingEvents, universities] =
    await Promise.all([
      prisma.university.count(),
      prisma.user.count({ where: { isActive: true } }),
      prisma.news.count({ where: { status: "PUBLISHED" } }),
      prisma.event.count({ where: { status: "PUBLISHED" } }),
      prisma.news.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.event.findMany({
        where: {
          status: "PUBLISHED",
          startDate: { gte: new Date() },
        },
        orderBy: { startDate: "asc" },
        take: 3,
      }),
      prisma.university.findMany({
        orderBy: { name: "asc" },
        select: { id: true, name: true, shortName: true },
      }),
    ]);

  return (
    <div>
      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTR2Mkg4VjI4aDI4em0wLTR2Mkg4di0yaDI4em0wLTR2Mkg4VjE2aDI4eiIvPjwvZz48L2c+PC9zdmc+')] opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary-300">
              Perhimpunan Fisikawan Indonesia
            </p>
            <h1 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
              PSI Cabang Surabaya
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-primary-200 sm:text-xl">
              Wadah Silaturahmi, Kolaborasi Riset, dan Pengembangan Pendidikan
              Fisika di Wilayah Jawa Timur
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/agenda"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-900 shadow transition-colors hover:bg-primary-50"
              >
                Lihat Agenda Terkini
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link
                href="/anggota"
                className="inline-flex items-center gap-2 rounded-lg border border-primary-400/40 bg-primary-800/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-primary-700/50"
              >
                Jelajahi Direktori Anggota
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========== STATS BAR ========== */}
      <section className="border-b border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            { label: "Kampus Anggota", value: totalKampus, icon: "M12 14l9-5-9-5-9 5 9 5z" },
            { label: "Dosen / Anggota", value: totalAnggota, icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" },
            { label: "Berita Publikasi", value: totalBerita, icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
            { label: "Agenda Kegiatan", value: totalAgenda, icon: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 bg-white px-6 py-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.icon} />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">{stat.value}</p>
                <p className="text-sm text-neutral-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========== BERITA TERKINI ========== */}
      {latestNews.length > 0 && (
        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Berita & Pengumuman
                </h2>
                <p className="mt-1 text-neutral-500">
                  Informasi terbaru dari PSI Surabaya
                </p>
              </div>
              <Link
                href="/berita"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {latestNews.map((news) => (
                <Link
                  key={news.id}
                  href={`/berita/${news.slug}`}
                  className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card transition-shadow hover:shadow-elevated"
                >
                  <div className="aspect-[16/9] bg-neutral-100">
                    {news.imageUrl ? (
                      <img
                        src={news.imageUrl}
                        alt={news.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <svg className="h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${NEWS_CATEGORY_COLORS[news.category] ?? "bg-neutral-100 text-neutral-600"}`}
                      >
                        {NEWS_CATEGORY_LABELS[news.category] ?? news.category}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {formatDate(news.publishedAt ?? news.createdAt)}
                      </span>
                    </div>
                    <h3 className="mt-3 line-clamp-2 text-base font-semibold text-neutral-900 group-hover:text-primary-600">
                      {news.title}
                    </h3>
                    {news.excerpt && (
                      <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                        {news.excerpt}
                      </p>
                    )}
                    <span className="mt-3 inline-flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
                      Baca Selengkapnya
                      <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== AGENDA TERDEKAT ========== */}
      {upcomingEvents.length > 0 && (
        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">
                  Agenda & Event Terdekat
                </h2>
                <p className="mt-1 text-neutral-500">
                  Kegiatan yang akan datang
                </p>
              </div>
              <Link
                href="/agenda"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Lihat Semua &rarr;
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/agenda/${event.slug}`}
                  className="group flex gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
                >
                  {/* Date badge */}
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary-50 text-center">
                    <span className="text-xs font-semibold uppercase text-primary-600">
                      {new Intl.DateTimeFormat("id-ID", { month: "short" }).format(new Date(event.startDate))}
                    </span>
                    <span className="text-xl font-bold text-primary-900">
                      {new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(new Date(event.startDate))}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-1 font-semibold text-neutral-900 group-hover:text-primary-600">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-sm text-neutral-500">
                      {formatEventDate(event.startDate)}
                    </p>
                    <div className="mt-2 flex items-center gap-1.5 text-sm text-neutral-600">
                      <svg className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="truncate">{event.location}</span>
                    </div>
                    {event.linkUrl && (
                      <span className="mt-2 inline-flex items-center text-xs font-medium text-primary-600">
                        Daftar Sekarang
                        <svg className="ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== KAMPUS ANGGOTA ========== */}
      {universities.length > 0 && (
        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-neutral-900">
                Perguruan Tinggi Anggota
              </h2>
              <p className="mt-1 text-neutral-500">
                Jaringan kampus yang tergabung dalam PSI Surabaya
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {universities.map((uni) => (
                <Link
                  key={uni.id}
                  href="/kampus"
                  className="group flex flex-col items-center rounded-xl border border-neutral-200 bg-white p-5 shadow-card transition-all hover:border-primary-200 hover:shadow-elevated"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700 transition-colors group-hover:bg-primary-200">
                    {(uni.shortName ?? uni.name).charAt(0)}
                  </div>
                  <p className="mt-3 text-center text-sm font-semibold text-neutral-900 group-hover:text-primary-600">
                    {uni.shortName ?? uni.name}
                  </p>
                  {uni.shortName && (
                    <p className="mt-0.5 text-center text-xs text-neutral-500 line-clamp-2">
                      {uni.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== CTA ========== */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-700 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Bergabung dengan PSI Surabaya
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-100">
            Dosen, peneliti, dan mahasiswa fisika di wilayah Jawa Timur dipersilakan
            untuk bergabung, mengikuti kegiatan, dan berkolaborasi dalam
            pengembangan ilmu fisika.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/anggota"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-primary-700 shadow transition-colors hover:bg-primary-50"
            >
              Lihat Direktori Anggota
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-400/40 bg-primary-800/50 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-primary-500/50"
            >
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
