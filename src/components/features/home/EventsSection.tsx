"use client";

import Link from "next/link";
import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

import { Button, Container, Section } from "@/components/ui/index";
import type { EventItem } from "@/components/features/events/data";

interface EventsSectionProps {
  events: EventItem[];
}

export function EventsSection({ events }: EventsSectionProps) {
  const mockEvents: EventItem[] = [
    {
      id: "event-1",
      slug: "penyelarasan-kurikulum-asesmen-obe",
      title: "Penyelarasan Kurikulum: Asesmen OBE",
      date: "29 Juli 2026",
      time: "09.30 - 12.30 WIB",
      location:
        "Ruang Meeting Rumpun Fisika, Gedung C3 Lantai 1, Universitas Negeri Surabaya",
      description:
        "Pertemuan anggota dan akademisi untuk membahas pengembangan serta penyelarasan kegiatan keilmuan fisika.",
      image: "/assets/activity/penyelarasan-kurikulum.jpeg",
      href: "/events/penyelarasan-kurikulum-asesmen-obe",
    },
    {
      id: "event-2",
      slug: "diskusi-pengembangan-komunitas-fisika",
      title: "Diskusi dan Pengembangan Komunitas Fisika",
      date: "8 Agustus 2026",
      time: "10.00 - 12.00 WIB",
      location: "Ruang Seminar Departemen Fisika, Universitas Negeri Surabaya",
      description:
        "Forum diskusi untuk memperkuat komunikasi, kolaborasi akademik, dan pengembangan komunitas fisika.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/events/diskusi-pengembangan-komunitas-fisika",
    },
    {
      id: "event-3",
      slug: "pertemuan-anggota-psi-cabang-surabaya",
      title: "Pertemuan Anggota PSI Cabang Surabaya",
      date: "22 Agustus 2026",
      time: "09.00 - 11.30 WIB",
      location: "Surabaya",
      description:
        "Pertemuan anggota sebagai ruang koordinasi dan pertukaran informasi kegiatan PSI Cabang Surabaya.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/events/pertemuan-anggota-psi-cabang-surabaya",
    },
    {
      id: "event-4",
      slug: "forum-kolaborasi-fisika-surabaya",
      title: "Forum Kolaborasi Fisika Surabaya",
      date: "5 September 2026",
      time: "09.00 - 12.00 WIB",
      location: "Surabaya",
      description:
        "Forum kolaborasi antara akademisi, peneliti, pendidik, mahasiswa, dan anggota komunitas fisika.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/events/forum-kolaborasi-fisika-surabaya",
    },
    {
      id: "event-5",
      slug: "seminar-fisika-dan-pendidikan",
      title: "Seminar Fisika dan Pendidikan",
      date: "19 September 2026",
      time: "08.30 - 13.00 WIB",
      location: "Gedung Auditorium Universitas Negeri Surabaya",
      description:
        "Seminar yang mempertemukan akademisi, pendidik, mahasiswa, dan praktisi untuk membahas perkembangan fisika dan pendidikan.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/events/seminar-fisika-dan-pendidikan",
    },
  ];

  const agenda = events.length > 0 ? events : mockEvents;
  const latestEvents = agenda.slice(0, 3);
  const featuredEvents = agenda.slice(0, 4);

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
              {latestEvents.map((event) => (
                <article key={event.id} className="py-5 first:pt-0 last:pb-0">
                  <time className="block text-sm text-foreground-muted">
                    {event.date}
                  </time>

                  <Link
                    href={event.href}
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
                  Agenda PSI Cabang Surabaya
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
              {featuredEvents.map((event) => {
                const [day, month, year] = event.date.split(" ");

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
                        href={event.href}
                        className="block text-base font-semibold leading-6 text-white transition-colors hover:text-primary-300 sm:text-lg"
                      >
                        {event.title}
                      </Link>

                      <div className="mt-2 flex items-start gap-2 text-xs leading-5 text-white/60 sm:text-sm">
                        <FaCalendarAlt
                          className="mt-1 h-3 w-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{event.time}</span>
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
                        href={event.href}
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