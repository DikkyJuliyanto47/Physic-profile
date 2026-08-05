import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { NewsCategory } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Berita & Pengumuman | PSI Surabaya",
  description: "Berita, pengumuman, dan informasi terbaru dari Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

const CATEGORY_COLORS: Record<string, string> = {
  ORGANISASI: "bg-blue-100 text-blue-700",
  SEMINAR: "bg-purple-100 text-purple-700",
  WORKSHOP: "bg-orange-100 text-orange-700",
  PERTEMUAN_RUTIN: "bg-teal-100 text-teal-700",
  KERJASAMA: "bg-indigo-100 text-indigo-700",
  PRESTASI_ANGGOTA: "bg-amber-100 text-amber-700",
};

const CATEGORY_LABELS: Record<string, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

const ALL_CATEGORIES = Object.values(NewsCategory);

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export default async function BeritaPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.kategori as NewsCategory | undefined;

  const where: Record<string, unknown> = { status: "PUBLISHED" };
  if (activeCategory && ALL_CATEGORIES.includes(activeCategory)) {
    where.category = activeCategory;
  }

  const [news, counts] = await Promise.all([
    prisma.news.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        slug: true,
        category: true,
        excerpt: true,
        imageUrl: true,
        publishedAt: true,
        createdAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.news.groupBy({
      by: ["category"],
      where: { status: "PUBLISHED" },
      _count: true,
    }),
  ]);

  const categoryCountMap = Object.fromEntries(
    counts.map((c) => [c.category, c._count])
  );

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Berita & Pengumuman
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Informasi terbaru, pengumuman resmi, dan kegiatan dari PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href="/berita"
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
              href={`/berita?kategori=${cat}`}
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

        {/* News Grid */}
        {news.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada berita yang dipublikasikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <Link
                key={item.id}
                href={`/berita/${item.slug}`}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="aspect-[16/9] bg-neutral-100">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
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
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[item.category] ?? "bg-neutral-100 text-neutral-600"}`}
                    >
                      {CATEGORY_LABELS[item.category] ?? item.category}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {formatDate(item.publishedAt ?? item.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-3 line-clamp-2 text-base font-semibold text-neutral-900 group-hover:text-primary-600">
                    {item.title}
                  </h2>
                  {item.excerpt && (
                    <p className="mt-2 line-clamp-2 text-sm text-neutral-500">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Oleh {item.author.name}
                    </span>
                    <span className="inline-flex items-center text-sm font-medium text-primary-600 group-hover:text-primary-700">
                      Baca
                      <svg className="ml-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
