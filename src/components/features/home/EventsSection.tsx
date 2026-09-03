"use client";

import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import { Button, Container, Section } from "@/components/ui/index";

interface EventSectionItem {
  id: string;
  slug: string;
  title: string;
  description: string;
  startDate: Date;
  location: string | null;
}

interface EventsSectionProps {
  events: EventSectionItem[];
}

export function EventsSection({ events }: EventsSectionProps) {
  return (
    <Section className="bg-background py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid border-y border-border lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-border px-0 py-8 sm:px-6 lg:border-b-0 lg:border-r lg:px-7 lg:py-10">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
              Aktivitas
            </span>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
              Kegiatan Terbaru
            </h2>

            <div className="mt-7 divide-y divide-border">
              {events.map((event) => (
                <article key={event.id} className="py-5 first:pt-0 last:pb-0">
                  <time className="block text-sm text-foreground-muted">
                    {new Intl.DateTimeFormat("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(event.startDate)}
                  </time>

                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-1.5 block text-base font-semibold leading-6 text-primary-900 transition-colors hover:text-primary-600"
                  >
                    {event.title}
                  </Link>

                  <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-foreground-muted">
                    <FaMapMarkerAlt
                      className="mt-1 h-3 w-3 shrink-0"
                      aria-hidden="true"
                    />
                    <span>{event.location}</span>
                  </div>
                </article>
              ))}
            </div>

            <Button
              href="/events"
              size="medium"
              className="mt-8 w-full bg-primary-900 text-white hover:bg-primary-800 sm:w-auto"
            >
              Lihat Semua Agenda
            </Button>
          </div>

          <div className="bg-primary-950 px-6 py-8 text-white sm:px-8 lg:px-10 lg:py-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300">
                  Agenda
                </span>

                <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Agenda Physical Society of Indonesia (PSI) Cabang Surabaya
                </h2>
              </div>

              <Link
                href="/events"
                className="hidden border-b border-white/30 pb-1 text-sm font-medium text-white transition-colors hover:border-primary-300 hover:text-primary-300 sm:inline-flex"
              >
                Lihat Semua Agenda →
              </Link>
            </div>

            <div className="mt-8 divide-y divide-white/10">
              {events.map((event) => {
                const dateParts = new Intl.DateTimeFormat("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }).formatToParts(event.startDate);
                const day = dateParts.find((part) => part.type === "day")?.value;
                const month = dateParts.find((part) => part.type === "month")?.value;
                const year = dateParts.find((part) => part.type === "year")?.value;
                const time = new Intl.DateTimeFormat("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }).format(event.startDate);

                return (
                  <article
                    key={event.id}
                    className="grid grid-cols-[76px_minmax(0,1fr)] gap-5 py-6 first:pt-0 last:pb-0 sm:grid-cols-[92px_minmax(0,1fr)] sm:gap-6"
                  >
                    <div className="h-fit bg-white text-center text-primary-950">
                      <div className="bg-primary-600 px-2 py-2 text-[10px] font-semibold uppercase tracking-wide text-white sm:text-[11px]">
                        {month} {year}
                      </div>

                      <div className="px-2 py-2.5 text-3xl font-bold leading-none tabular-nums sm:py-3 sm:text-4xl">
                        {day}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={`/events/${event.slug}`}
                        className="block text-base font-semibold leading-6 text-white transition-colors hover:text-primary-300 sm:text-lg"
                      >
                        {event.title}
                      </Link>

                      <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-white/60 sm:text-sm">
                        <FaCalendarAlt
                          className="mt-1 h-3 w-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{time}</span>
                      </div>

                      <div className="mt-1 flex items-start gap-2 text-xs leading-5 text-white/60 sm:text-sm">
                        <FaMapMarkerAlt
                          className="mt-1 h-3 w-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{event.location}</span>
                      </div>

                      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
                        {event.description}
                      </p>

                      <Link
                        href={`/events/${event.slug}`}
                        className="mt-4 inline-flex text-sm font-medium text-white transition-colors hover:text-primary-300"
                      >
                        Lihat Detail →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>

            <Link
              href="/events"
              className="mt-8 inline-flex border-b border-white/30 pb-1 text-sm font-medium text-white transition-colors hover:border-primary-300 hover:text-primary-300 sm:hidden"
            >
              Lihat Semua Events →
            </Link>
          </div>
        </div>
      </Container>
    </Section>
  );
}