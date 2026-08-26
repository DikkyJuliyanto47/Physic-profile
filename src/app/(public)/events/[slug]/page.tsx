import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Container, Section } from "@/components/ui";

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
  }).format(date);
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      title: true,
      description: true,
      imageUrl: true,
      category: true,
      location: true,
    },
  });

  if (!event) {
    return {
      title: "Events Tidak Ditemukan",
    };
  }

  const categoryName = CATEGORY_LABELS[event.category] ?? event.category;
  const description = event.description.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: event.title,
    description: `${categoryName} — ${event.location}. ${description}`,
    openGraph: {
      title: event.title,
      description,
      type: "article",
      locale: "id_ID",
      siteName: "PSI Cabang Surabaya",
      ...(event.imageUrl && {
        images: [
          {
            url: event.imageUrl,
            width: 1200,
            height: 630,
            alt: event.title,
          },
        ],
      }),
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const event = await prisma.event.findUnique({
    where: {
      slug,
      status: "PUBLISHED",
    },
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

  if (!event) {
    notFound();
  }

  const categoryLabel =
    CATEGORY_LABELS[event.category] ?? event.category;

  const isPast = new Date(event.startDate) < new Date();

  return (
    <main>
      <Section className="border-b border-border" padding="normal">
        <Container>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-primary-600"
          >
            <span aria-hidden="true">←</span>
            Kembali ke Events
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                {categoryLabel}
              </span>

              {isPast && (
                <span className="text-xs font-medium text-foreground-muted">
                  Event telah selesai
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-primary-950 sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
          </div>
        </Container>
      </Section>

      <Section padding="normal">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <article className="min-w-0">
              {event.imageUrl && (
                <div className="relative aspect-video overflow-hidden border border-border">
                  <Image
                    src={event.imageUrl}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 760px"
                  />
                </div>
              )}

              <div
                className="prose prose-lg mt-8 max-w-none prose-headings:font-semibold prose-headings:text-primary-950 prose-p:text-foreground-muted prose-a:text-primary-600 prose-img:border prose-img:border-border"
                dangerouslySetInnerHTML={{
                  __html: event.description,
                }}
              />
            </article>

            <aside>
              <div className="border-y border-border lg:border-t-0">
                <div className="border-b border-border py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                    Waktu
                  </p>

                  <p className="mt-2 font-semibold text-primary-950">
                    {formatFullDate(event.startDate)}
                  </p>

                  <p className="mt-1 text-sm text-foreground-muted">
                    {formatTime(event.startDate)}
                    {event.endDate && (
                      <> — {formatTime(event.endDate)} WIB</>
                    )}
                  </p>
                </div>

                <div className="border-b border-border py-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                    Lokasi
                  </p>

                  <p className="mt-2 font-semibold leading-6 text-primary-950">
                    {event.location}
                  </p>
                </div>

                {event.linkUrl && (
                  <div className="py-5">
                    <a
                      href={event.linkUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-sm font-semibold text-primary-900 transition-colors hover:text-primary-600"
                    >
                      Daftar / Info Selengkapnya →
                    </a>
                  </div>
                )}
              </div>
            </aside>
          </div>

          <div className="mt-12 border-t border-border pt-6">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 transition-colors hover:text-primary-600"
            >
              <span aria-hidden="true">←</span>
              Kembali ke Semua Events
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}