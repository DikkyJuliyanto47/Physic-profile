import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

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

function formatFullDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: { title: true, description: true, imageUrl: true, category: true, startDate: true, endDate: true, location: true },
  });

  if (!event) return { title: "Agenda Tidak Ditemukan" };

  const description = event.description.slice(0, 160);
  const ogImage = event.imageUrl ?? undefined;
  const categoryName = CATEGORY_LABELS[event.category] ?? event.category;

  return {
    title: event.title,
    description: `${categoryName} — ${event.location}. ${description}`,
    openGraph: {
      title: event.title,
      description: `${categoryName} — ${event.location}. ${description}`,
      type: "article",
      locale: "id_ID",
      siteName: "PSI Cabang Surabaya",
      ...(ogImage && { images: [{ url: ogImage, width: 1200, height: 630, alt: event.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description: `${categoryName} — ${event.location}. ${description}`,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function AgendaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: { slug, status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      startDate: true,
      endDate: true,
      location: true,
      imageUrl: true,
      linkUrl: true,
    },
  });

  if (!event) notFound();

  const categoryLabel = CATEGORY_LABELS[event.category] ?? event.category;
  const categoryColor = CATEGORY_COLORS[event.category] ?? "bg-neutral-100 text-neutral-600";
  const isPast = new Date(event.startDate) < new Date();

  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-12 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Agenda
          </Link>
          <div className="mt-4 flex items-center gap-2">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${categoryColor}`}>
              {categoryLabel}
            </span>
            {isPast && (
              <span className="inline-flex items-center rounded-full bg-neutral-600/30 px-3 py-1 text-xs font-medium text-white/80">
                Telah Selesai
              </span>
            )}
          </div>
          <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl lg:text-4xl">
            {event.title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Event Info Card */}
        <div className="mb-8 rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Waktu Pelaksanaan</p>
                <p className="mt-0.5 font-semibold text-neutral-900">
                  {formatFullDate(event.startDate)}
                </p>
                <p className="text-sm text-neutral-600">
                  {formatTime(event.startDate)}
                  {event.endDate && <> &mdash; {formatTime(event.endDate)}</>}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500">Lokasi</p>
                <p className="mt-0.5 font-semibold text-neutral-900">{event.location}</p>
              </div>
            </div>
          </div>

          {event.linkUrl && (
            <div className="mt-6 border-t border-neutral-100 pt-4">
              <a
                href={event.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
              >
                Daftar / Info Selengkapnya
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
            </div>
          )}
        </div>

        {event.imageUrl && (
          <div className="mb-8 overflow-hidden rounded-xl">
            <img
              src={event.imageUrl}
              alt={event.title}
              className="h-auto w-full object-cover"
            />
          </div>
        )}

        <div
          className="prose prose-lg max-w-none prose-headings:text-neutral-900 prose-p:text-neutral-700 prose-a:text-primary-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />

        <div className="mt-12 border-t border-neutral-200 pt-6">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Daftar Agenda
          </Link>
        </div>
      </article>
    </div>
  );
}
