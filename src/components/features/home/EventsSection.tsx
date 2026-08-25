"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";

import {
  Button,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";

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
      date: "29 Juli 2025",
      time: "09.30 - 12.30 WIB",
      location:
        "Ruang Meeting Rumpun Fisika, Gedung C3 Lantai 1, Universitas Negeri Surabaya",
      description:
        "Pertemuan rutin anggota Physical Society of Indonesia (PSI) Cabang Surabaya.",
      image: "/assets/activity/penyelarasan-kurikulum.jpeg",
      views: 10,
      href: "/agenda",
    },
    {
      id: "agenda-2",
      title: "Diskusi dan Pengembangan Komunitas Fisika",
      date: "8 Agustus 2025",
      time: "10.00 - 12.00 WIB",
      location:
        "Ruang Seminar Departemen Fisika, Universitas Negeri Surabaya",
      description:
        "Forum diskusi anggota untuk membahas pengembangan kegiatan komunitas dan kolaborasi akademik.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      views: 18,
      href: "/agenda",
    },
    {
      id: "agenda-3",
      title: "Pertemuan Anggota PSI Cabang Surabaya",
      date: "22 Agustus 2025",
      time: "09.00 - 11.30 WIB",
      location: "Surabaya",
      description:
        "Pertemuan anggota sebagai ruang koordinasi dan pertukaran informasi kegiatan PSI Cabang Surabaya.",
      image: "/assets/activity/pertemuan-07-27-01.jpeg",
      views: 24,
      href: "/agenda",
    },
  ];

  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;

    if (
      !track ||
      track.clientWidth === 0 ||
      upcomingAgenda.length === 0
    ) {
      return;
    }

    const index = Math.round(track.scrollLeft / track.clientWidth);

    setActiveIndex(
      Math.min(Math.max(index, 0), upcomingAgenda.length - 1),
    );
  };

  const goToSlide = (index: number) => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    track.scrollTo({
      left: index * track.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <Section tone="muted" className="py-16 lg:py-20">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-32 -top-32
          h-72 w-72
          rounded-full
          bg-primary-500/10
          sm:-left-40 sm:-top-40
          sm:h-96 sm:w-96
          lg:-left-48 lg:-top-48
          lg:h-112 lg:w-md" 
        />

      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -left-32 -top-32
          h-72 w-72
          rounded-full
          bg-primary-500/10
          sm:-left-40 sm:-top-40
          sm:h-96 sm:w-96
          lg:-left-48 lg:-top-48
          lg:h-112 lg:w-md
        "
      />

      <div 
        aria-hidden="true"
        className="
          pointer-events-none absolute
          -bottom-28 -right-32
          h-72 w-72
          rounded-full
          bg-primary-500/8
          sm:-bottom-36 sm:-right-40
          sm:h-96 sm:w-96
          lg:-bottom-44 lg:-right-48
          lg:h-112 lg:w-md
        "
      />
      <Container className="flex flex-col items-center gap-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Agenda"
            title="Agenda PSI Cabang Surabaya"
            align="center"
          />
        </div>

        {upcomingAgenda.length === 0 ? (
          <div className="w-full max-w-4xl border border-dashed border-border bg-background px-6 py-12 text-center text-sm text-foreground-muted">
            Belum ada agenda mendatang yang dipublikasikan.
          </div>
        ) : (
          <div className="w-full max-w-5xl">
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="
                flex snap-x snap-mandatory gap-5
                overflow-x-auto pb-3
                scrollbar-none
                [-ms-overflow-style:none]
                sm:grid sm:grid-cols-2
                sm:overflow-visible sm:pb-0
                lg:grid-cols-3
                [&::-webkit-scrollbar]:hidden
              "
              style={{ scrollbarWidth: "none" }}
            >
              {upcomingAgenda.map((item) => (
                <article
                  key={item.id}
                  className="
                    group relative flex
                    w-[84vw] min-w-0
                    shrink-0 snap-center
                    flex-col overflow-hidden
                    rounded-[1rem]
                    border border-border/70
                    bg-white
                    text-center
                    shadow-[0_6px_22px_rgba(15,23,42,0.055)]
                    transition-[transform,box-shadow,border-color]
                    duration-300 ease-out
                    hover:-translate-y-1
                    hover:border-primary-100
                    hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)]
                    sm:w-auto
                  "
                >
                  <Link
                    href={item.href}
                    className="
                      block overflow-hidden
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-inset
                      focus-visible:ring-primary-400
                    "
                  >
                    <div className="relative aspect-16/10 overflow-hidden bg-background-muted">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="
                            (min-width: 1024px) 30vw,
                            (min-width: 640px) 45vw,
                            84vw
                          "
                          className="
                            object-cover
                            transition-transform
                            duration-500 ease-out
                            group-hover:scale-[1.025]
                          "
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
                          Foto kegiatan
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-5 sm:px-6">
                    <time
                      className="
                        inline-flex items-center gap-2
                        text-xs font-semibold
                        uppercase tracking-widest
                        text-primary-600
                      "
                    >
                      <FaCalendarAlt
                        className="h-3 w-3"
                        aria-hidden="true"
                      />

                      {item.date}
                    </time>

                    <p className="mt-2 text-xs font-medium text-foreground-muted">
                      {item.time}
                    </p>

                    <h3
                      className="
                        mt-3
                        line-clamp-2
                        text-base font-bold
                        leading-6 tracking-tight
                        text-foreground
                        sm:text-lg
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      className="
                        mt-3
                        line-clamp-2
                        max-w-xs
                        text-sm leading-6
                        text-foreground-muted
                      "
                    >
                      {item.location}
                    </p>

                    <p
                      className="
                        mt-2
                        line-clamp-2
                        max-w-xs
                        text-xs leading-5
                        text-foreground-muted
                      "
                    >
                      {item.description}
                    </p>

                    {item.href && (
                      <Link
                        href={item.href}
                        className="
                          mt-5 inline-flex
                          items-center gap-1.5
                          border-b border-transparent
                          pb-0.5
                          text-xs font-semibold
                          text-primary-600
                          transition-[color,border-color,gap]
                          duration-200
                          hover:gap-2.5
                          hover:border-primary-600
                          hover:text-primary-700
                          focus-visible:outline-none
                          focus-visible:ring-2
                          focus-visible:ring-primary-300
                          focus-visible:ring-offset-2
                        "
                      >
                        Lihat agenda
                        <span aria-hidden="true">→</span>
                      </Link>
                    )}
                  </div>

                  <div
                    aria-hidden="true"
                    className="
                      absolute bottom-0 left-1/2
                      h-0.5 w-0
                      -translate-x-1/2
                      bg-primary-600
                      transition-[width]
                      duration-300 ease-out
                      group-hover:w-10
                    "
                  />
                </article>
              ))}
            </div>
          </div>
        )}

        {upcomingAgenda.length > 1 && (
          <div className="flex items-center gap-1.5 sm:hidden">
            {upcomingAgenda.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Agenda ${index + 1}`}
                aria-current={activeIndex === index}
                className={`
                  h-1.5 rounded-full
                  transition-[width,background-color]
                  duration-200
                  ${
                    activeIndex === index
                      ? "w-6 bg-primary-600"
                      : "w-1.5 bg-border"
                  }
                `}
              />
            ))}
          </div>
        )}

        <Button href="/agenda" size="medium" variant="outline">
          Lihat Semua Agenda →
        </Button>
      </Container>
    </Section>
  );
}