"use client";

import { useMemo } from "react";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

import { Button, Container, Section } from "@/components/ui";
import type { EventItem } from "@/components/features/events/data";

interface EventsSectionProps {
  events: EventItem[];
}

export function EventsSection({ events }: EventsSectionProps) {
  /*
   * TODO: Gunakan kembali `events` ketika data agenda/event sudah
   * tersambung dengan sumber data sebenarnya.
   *
   * const upcomingAgenda = events;
   */

  // TEMPORARY MOCK DATA
  // Hanya untuk pengujian visual landing page.
  // Hapus blok ini dan gunakan `events` ketika data sudah tersedia.
  const upcomingAgenda = [
    {
      id: "agenda-1",
      title: "Penyelarasan Kurikulum: Asesmen OBE",
      date: "29 Juli 2026",
      time: "09.30 - 12.30 WIB",
      location:
        "Ruang Meeting Rumpun Fisika, Gedung C3 Lantai 1, Universitas Negeri Surabaya",
      description:
        "Pertemuan anggota dan akademisi untuk membahas pengembangan serta penyelarasan kegiatan keilmuan fisika.",
      image: "/assets/activity/penyelarasan-kurikulum.jpeg",
      href: "/agenda",
    },
    {
      id: "agenda-2",
      title: "Diskusi dan Pengembangan Komunitas Fisika",
      date: "8 Agustus 2026",
      time: "10.00 - 12.00 WIB",
      location:
        "Ruang Seminar Departemen Fisika, Universitas Negeri Surabaya",
      description:
        "Forum diskusi untuk memperkuat komunikasi, kolaborasi akademik, dan pengembangan komunitas fisika.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/agenda",
    },
    {
      id: "agenda-3",
      title: "Pertemuan Anggota PSI Cabang Surabaya",
      date: "22 Agustus 2026",
      time: "09.00 - 11.30 WIB",
      location: "Surabaya",
      description:
        "Pertemuan anggota sebagai ruang koordinasi dan pertukaran informasi kegiatan PSI Cabang Surabaya.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/agenda",
    },
    {
      id: "agenda-4",
      title: "Forum Kolaborasi Fisika Surabaya",
      date: "5 September 2026",
      time: "09.00 - 12.00 WIB",
      location: "Surabaya",
      description:
        "Forum kolaborasi antara akademisi, peneliti, pendidik, mahasiswa, dan anggota komunitas fisika.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      href: "/agenda",
    },
  ];

  const agenda = events.length > 0 ? events : upcomingAgenda;

  const latestActivities = useMemo(() => agenda.slice(0, 5), [agenda]);
  const featuredAgenda = agenda.slice(0, 5);
  const additionalActivities = useMemo(() => agenda.slice(1, 6), [agenda]);

  return (
    <Section className="bg-background py-14 sm:py-16 lg:py-20">
      <Container>
        <div className="grid border-y border-border lg:grid-cols-[1fr_1.05fr_1fr]">
          <div className="px-0 py-8 sm:px-6 lg:px-7 lg:py-10">
            <h2 className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
              Kegiatan Terbaru
            </h2>

            <div className="mt-7 space-y-6">
              {latestActivities.map((item) => (
                <article key={`latest-${item.id}`}>
                  <time className="block text-sm text-foreground-muted">
                    {item.date}
                  </time>

                  <Link
                    href={item.href ?? "/agenda"}
                    className="mt-1.5 block text-base font-semibold leading-6 text-primary-900 transition-colors hover:text-primary-600"
                  >
                    {item.title}
                  </Link>
                </article>
              ))}
            </div>

            <Button
              href="/agenda"
              size="medium"
              className="mt-8 w-full bg-primary-900 text-white hover:bg-primary-800 sm:w-auto"
            >
              Lihat Semua Kegiatan
            </Button>
          </div>

          <div className="bg-primary-950 px-6 py-8 text-white sm:px-8 lg:px-9 lg:py-10">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Agenda PSI
            </h2>

            <div className="mt-7 space-y-5">
              {featuredAgenda.map((item) => {
                const [day, month, year] = item.date.split(" ");

                return (
                  <article
                    key={`agenda-${item.id}`}
                    className="grid grid-cols-[96px_minmax(0,1fr)] gap-4"
                  >
                    <div className="h-fit overflow-hidden bg-white text-center text-primary-950">
                      <div className="bg-primary-600 px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white">
                        {month} {year}
                      </div>

                      <div className="px-2 py-2 text-3xl font-bold leading-none tabular-nums sm:text-4xl">
                        {day}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <Link
                        href={item.href ?? "/agenda"}
                        className="block text-base font-semibold leading-6 text-white transition-colors hover:text-primary-300"
                      >
                        {item.title}
                      </Link>

                      <div className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-white/65">
                        <FaCalendarAlt
                          className="mt-1 h-3 w-3 shrink-0"
                          aria-hidden="true"
                        />
                        <span>{item.time}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <Link
              href="/agenda"
              className="mt-8 inline-flex border-b border-white/40 pb-1 text-sm font-medium text-white transition-colors hover:border-primary-300 hover:text-primary-300"
            >
              Selengkapnya tentang agenda →
            </Link>
          </div>

          <div className="px-0 py-8 sm:px-6 lg:px-7 lg:py-10">
            <h2 className="text-2xl font-semibold tracking-tight text-primary-900 sm:text-3xl">
              Informasi Kegiatan
            </h2>

            <div className="mt-7 space-y-6">
              {additionalActivities.map((item) => (
                <article key={`info-${item.id}`}>
                  <time className="block text-sm text-foreground-muted">
                    {item.date}
                  </time>

                  <Link
                    href={item.href ?? "/agenda"}
                    className="mt-1.5 block text-base font-semibold leading-6 text-primary-900 transition-colors hover:text-primary-600"
                  >
                    {item.title}
                  </Link>
                </article>
              ))}
            </div>

            <Button
              href="/agenda"
              variant="outline"
              size="medium"
              className="mt-8 w-full border-primary-900 text-primary-900 hover:bg-primary-900 hover:text-white sm:w-auto"
            >
              Jelajahi Agenda →
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}