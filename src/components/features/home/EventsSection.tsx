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

    if (!track || upcomingAgenda.length === 0) {
      return;
    }

    const cards = Array.from(
      track.querySelectorAll<HTMLElement>("[data-agenda-card]"),
    );

    if (cards.length === 0) {
      return;
    }

    const scrollPosition = track.scrollLeft + track.clientWidth / 2;

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - scrollPosition);

      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveIndex(closestIndex);
  };

  const goToSlide = (index: number) => {
    const track = trackRef.current;
    const card = track?.querySelector<HTMLElement>(
      `[data-agenda-index="${index}"]`,
    );

    if (!track || !card) {
      return;
    }

    track.scrollTo({
      left: card.offsetLeft,
      behavior: "smooth",
    });

    setActiveIndex(index);
  };

  return (
    <Section
      tone="muted"
      className="
        relative
        overflow-hidden
        py-16
        sm:py-20
        lg:py-24
      "
    >
      <Container className="relative z-10 flex flex-col items-center">
        <div>
          <SectionHeading
            eyebrow="Kegiatan Terbaru"
            title="Kegiatan Terbaru PSI Cabang Surabaya"
            align="center"
          />
        </div>

        {upcomingAgenda.length === 0 ? (
          <div className="mt-8 w-full max-w-4xl border border-dashed border-border bg-background px-6 py-12 text-center text-sm text-foreground-muted">
            Belum ada agenda mendatang yang dipublikasikan.
          </div>
        ) : (
          <div className="mt-8 w-full max-w-6xl">
            <div
              ref={trackRef}
              onScroll={handleScroll}
              className="
                flex
                snap-x
                snap-mandatory
                gap-5
                overflow-x-auto
                px-1
                pb-3
                scrollbar-none
                [-ms-overflow-style:none]
                [&::-webkit-scrollbar]:hidden

                sm:grid
                sm:grid-cols-2
                sm:gap-5
                sm:overflow-visible
                sm:px-0
                sm:pb-0

                lg:grid-cols-3
              "
              style={{ scrollbarWidth: "none" }}
            >
              {upcomingAgenda.map((item, index) => (
                <article
                  key={item.id}
                  data-agenda-card
                  data-agenda-index={index}
                  className="
                    group
                    relative
                    flex
                    w-[90vw]
                    min-w-0
                    shrink-0
                    snap-center
                    flex-col

                    sm:w-auto
                  "
                >
                  
                  <div
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      -inset-2
                      rounded-[0.65rem]
                      bg-black/[0.07]
                      blur-xl
                      transition-opacity
                      duration-300
                      group-hover:bg-black/11
                    "
                  />

                  <div
                    className="
                      relative
                      flex
                      flex-1
                      flex-col
                      overflow-hidden
                      rounded-[0.45rem]
                      border
                      border-border/60
                      bg-white
                      text-center

                      shadow-[0_3px_10px_rgba(15,23,42,0.045)]

                      transition-[transform,box-shadow,border-color]
                      duration-300
                      ease-out

                      group-hover:-translate-y-0.5
                      group-hover:border-border
                      group-hover:shadow-[0_10px_22px_rgba(15,23,42,0.09)]
                    "
                  >
                    <Link
                      href={item.href ?? "/agenda"}
                      className="
                        block
                        overflow-hidden
                        focus-visible:outline-none
                        focus-visible:ring-2
                        focus-visible:ring-inset
                        focus-visible:ring-primary-400
                      "
                    >
                      <div
                        className="
                          relative
                          aspect-16/8.5
                          overflow-hidden
                          bg-background-muted

                          sm:aspect-16/8
                        "
                      >
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
                              duration-500
                              ease-out
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

                    <div
                      className="
                        flex
                        flex-1
                        flex-col
                        items-start
                        px-4
                        pb-4
                        pt-3
                        text-left
                        sm:px-5
                      "
                    >
                      <time
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-[11px]
                          font-medium
                          text-primary-600
                          sm:text-xs
                        "
                      >
                        <FaCalendarAlt
                          className="h-3 w-3 shrink-0"
                          aria-hidden="true"
                        />

                        {item.date}
                      </time>

                      <p
                        className="
                          mt-2
                          line-clamp-2
                          text-xs
                          leading-5
                          text-foreground
                        "
                      >
                        {item.description ?? item.location}
                      </p>

                      {item.href && (
                        <Link
                          href={item.href}
                          className="
                            mt-2
                            inline-flex
                            items-center
                            gap-1
                            text-[11px]
                            font-medium
                            text-primary-600

                            transition-[color,gap]
                            duration-200

                            hover:gap-1.5
                            hover:text-primary-700

                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-primary-300
                            focus-visible:ring-offset-2
                          "
                        >
                          Baca Selengkapnya
                          <span aria-hidden="true">→</span>
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {upcomingAgenda.length > 1 && (
          <div className="mt-5 flex items-center gap-1.5 sm:hidden">
            {upcomingAgenda.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Kegiatan ${index + 1}`}
                aria-current={activeIndex === index}
                className={`
                  h-1.5
                  rounded-full
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

        <Button
          href="/agenda"
          size="medium"
          variant="outline"
          className="mt-7"
        >
          Lihat Semua Kegiatan →
        </Button>
      </Container>
    </Section>
  );
}