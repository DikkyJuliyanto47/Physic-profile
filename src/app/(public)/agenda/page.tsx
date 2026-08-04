import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { EventCategory } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Agenda & Kegiatan | PSI Surabaya",
  description: "Jadwal seminar, workshop, kuliah tamu, dan kegiatan lainnya dari Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

const CATEGORY_COLORS: Record<string, string> = {
  SEMINAR_NASIONAL: "bg-purple-100 text-purple-700",
  KULIAH_TAMU: "bg-blue-100 text-blue-700",
  WEBINAR: "bg-teal-100 text-teal-700",
  WORKSHOP: "bg-orange-100 text-orange-700",
  MUSYAWARAH_ANGGOTA: "bg-indigo-100 text-indigo-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  SEMINAR_NASIONAL: "Seminar Nasional",
  KULIAH_TAMU: "Kuliah Tamu",
  WEBINAR: "Webinar",
  WORKSHOP: "Workshop",
  MUSYAWARAH_ANGGOTA: "Musyawarah Anggota",
};

const ALL_CATEGORIES = Object.values(EventCategory);

function formatShortDate(date: Date): { day: string; month: string; year: string } {
  const d = new Date(date);
  return {
    day: new Intl.DateTimeFormat("id-ID", { day: "numeric" }).format(d),
    month: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(d),
    year: new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(d),
  };
}

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function AgendaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.kategori as EventCategory | undefined;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (activeCategory && ALL_CATEGORIES.includes(activeCategory)) {
    where.category = activeCategory;
  }

  const [events, counts] = await Promise.all([
    prisma.event.findMany({
      where,
      orderBy: { startDate: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        startDate: true,
        endDate: true,
        location: true,
        imageUrl: true,
        linkUrl: true,
      },
    }),
    prisma.event.groupBy({
      by: ["category"],
      where: { status: "PUBLISHED" },
      _count: true,
    }),
  ]);

  const categoryCountMap = Object.fromEntries(
    counts.map((c) => [c.category, c._count])
  );

  const now = new Date();

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Agenda & Kegiatan
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Seminar, workshop, kuliah tamu, dan kegiatan lainnya dari PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/agenda"
            className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              !activeCategory
                ? "bg-primary-600 text-white"
                : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-600"
            }`}
          >
            Semua
          </Link>
          {ALL_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/agenda?kategori=${cat}`}
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300 hover:text-primary-600"
              }`}
            >
              {CATEGORY_LABELS[cat] ?? cat}
              {categoryCountMap[cat] && (
                <span className={`ml-0.5 text-xs ${activeCategory === cat ? "text-primary-200" : "text-neutral-400"}`}>
                  {categoryCountMap[cat]}
                </span>
              )}
            </Link>
          ))}
        </div>

        {/* Events List */}
        {events.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada agenda yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map((event) => {
              const dateParts = formatShortDate(event.startDate);
              const isPast = new Date(event.startDate) < now;
              return (
                <Link
                  key={event.id}
                  href={`/agenda/${event.slug}`}
                  className={`group flex gap-5 rounded-xl border bg-white p-5 shadow-card transition-shadow hover:shadow-elevated ${
                    isPast ? "border-neutral-200 opacity-70" : "border-neutral-200"
                  }`}
                >
                  {/* Date badge */}
                  <div className="flex h-18 w-18 flex-shrink-0 flex-col items-center justify-center rounded-xl bg-primary-50 text-center">
                    <span className="text-xs font-semibold uppercase text-primary-600">
                      {dateParts.month}
                    </span>
                    <span className="text-2xl font-bold text-primary-900">
                      {dateParts.day}
                    </span>
                    <span className="text-[10px] text-primary-500">
                      {dateParts.year}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[event.category] ?? "bg-neutral-100 text-neutral-600"}`}
                      >
                        {CATEGORY_LABELS[event.category] ?? event.category}
                      </span>
                      {isPast && (
                        <span className="inline-flex items-center rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-500">
                          Selesai
                        </span>
                      )}
                    </div>
                    <h2 className="mt-2 line-clamp-1 text-lg font-semibold text-neutral-900 group-hover:text-primary-600">
                      {event.title}
                    </h2>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatFullDate(event.startDate)}
                        {event.endDate && (
                          <> &mdash; {formatFullDate(event.endDate)}</>
                        )}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                        </svg>
                        {event.location}
                      </span>
                    </div>
                    {event.linkUrl && (
                      <span className="mt-3 inline-flex items-center text-sm font-medium text-primary-600">
                        Daftar Sekarang
                        <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                        </svg>
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
