import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getEventBySlug } from "@/lib/data";
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
  const event = await getEventBySlug(slug);

  if (!event) {
    return { title: "Events Tidak Ditemukan" };
  }

  const categoryName = CATEGORY_LABELS[event.category] ?? event.category;
  const description = event.description.replace(/<[^>]*>/g, "").slice(0, 160);

  return {
    title: event.title,
    description: event.location
      ? `${categoryName} — ${event.location}. ${description}`
      : `${categoryName} — ${description}`,
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
  const event = await getEventBySlug(slug);

  if (!event) notFound();

  const categoryLabel = CATEGORY_LABELS[event.category] ?? event.category;
  const isPast = new Date(event.startDate) < new Date();

  return (
    <main>
      <Section padding="normal">
        <Container>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-primary-600"
          >
            <span aria-hidden="true">←</span>
            Kembali ke Agenda
          </Link>

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                {categoryLabel}
              </span>

              {isPast && (
                <span className="text-xs font-medium text-foreground-muted">
                  Agenda telah selesai
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-primary-950 sm:text-4xl lg:text-5xl">
              {event.title}
            </h1>
          </div>
        </Container>
      </Section>

      <Section padding="normal" className="pt-0">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-14">
            <article className="min-w-0">
              {event.imageUrl && (
                <div className="relative aspect-video overflow-hidden rounded-md bg-background-muted">
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
                className="prose prose-lg mt-8 max-w-none prose-headings:font-semibold prose-headings:text-primary-950 prose-p:text-foreground-muted prose-a:text-primary-600"
                dangerouslySetInnerHTML={{
                  __html: event.description,
                }}
              />
            </article>

            <aside className="lg:pt-1">
              <div className="space-y-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                    Waktu
                  </p>

                  <p className="mt-2 font-semibold leading-6 text-primary-950">
                    {formatFullDate(event.startDate)}
                  </p>

                  <p className="mt-1 text-sm text-foreground-muted">
                    {formatTime(event.startDate)}
                    {event.endDate && (
                      <> — {formatTime(event.endDate)} WIB</>
                    )}
                  </p>
                </div>

                {event.location && (
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                      Lokasi
                    </p>

                    <p className="mt-2 font-semibold leading-6 text-primary-950">
                      {event.location}
                    </p>

                    <div className="mt-3 overflow-hidden rounded-md border border-neutral-200">
                      <iframe
                        src={`https://www.google.com/maps?q=${encodeURIComponent(event.location)}&output=embed`}
                        width="100%"
                        height="250"
                        style={{ border: 0 }}
                        allowFullScreen={false}
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Peta lokasi acara"
                      />
                    </div>
                  </div>
                )}

                {event.linkUrl && (
                  <div>
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

          <div className="mt-14">
            <Link
              href="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 transition-colors hover:text-primary-600"
            >
              <span aria-hidden="true">←</span>
              Kembali ke Semua Agenda
            </Link>
          </div>
        </Container>
      </Section>
    </main>
  );
}
