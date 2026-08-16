import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const news = await prisma.news.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, excerpt: true, imageUrl: true, category: true, publishedAt: true },
  });

  if (!news) return { title: "Berita Tidak Ditemukan" };

  const description = news.excerpt ?? `Berita ${news.category} dari PSI Cabang Surabaya`;
  const ogImage = news.imageUrl ?? undefined;

  return {
    title: news.title,
    description,
    openGraph: {
      title: news.title,
      description,
      type: "article",
      locale: "id_ID",
      siteName: "PSI Cabang Surabaya",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: news.title }] }),
      ...(news.publishedAt && { publishedTime: news.publishedAt.toISOString() }),
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const news = await prisma.news.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      category: true,
      excerpt: true,
      content: true,
      imageUrl: true,
      publishedAt: true,
      createdAt: true,
      author: { select: { name: true } },
    },
  });

  if (!news) notFound();

  const categoryLabel = CATEGORY_LABELS[news.category] ?? news.category;
  const categoryColor = CATEGORY_COLORS[news.category] ?? "bg-neutral-100 text-neutral-600";

  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Berita
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${categoryColor}`}>
              {categoryLabel}
            </span>
            <span className="text-sm text-primary-300">
              {formatDate(news.publishedAt ?? news.createdAt)}
            </span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {news.title}
          </h1>
          <p className="mt-3 text-primary-200">
            Ditulis oleh {news.author.name}
          </p>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {news.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={news.imageUrl}
              alt={news.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        {news.excerpt && (
          <p className="mb-6 text-lg leading-relaxed text-neutral-600 border-l-4 border-primary-500 pl-4 italic">
            {news.excerpt}
          </p>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />

        {/* Share / Back */}
        <div className="mt-12 border-t border-neutral-200 pt-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Daftar Berita
          </Link>
        </div>
      </article>
    </div>
  );
}
