/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 09:11:53
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 12:00:00
 */

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Button,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { upcomingAgenda } from "./data";

export function EventsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    const track = trackRef.current;

    if (!track || track.clientWidth === 0) return;

    const index = Math.round(track.scrollLeft / track.clientWidth);

    setActiveIndex(
      Math.min(Math.max(index, 0), upcomingAgenda.length - 1)
    );
  };

  const goToSlide = (index: number) => {
    const track = trackRef.current;

    if (!track) return;

    track.scrollTo({
      left: index * track.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <Section
      tone="muted"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-1/2
          h-64
          w-[80%]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-primary-600/5
          blur-3xl
        "
      />

      <Container className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Kegiatan Terbaru"
            title="Kegiatan Terbaru PSI Cabang Surabaya"
            align="center"
          />

          <div className="mx-auto mt-3 h-0.5 w-16 bg-primary-600" />
        </div>

        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="
            flex w-full snap-x snap-mandatory gap-5 overflow-x-auto
            scroll-smooth pb-1 scrollbar-none
            [-ms-overflow-style:none] sm:flex-wrap sm:justify-center
            sm:snap-none sm:overflow-visible [&::-webkit-scrollbar]:hidden
          "
          style={{ scrollbarWidth: "none" }}
        >
          {upcomingAgenda.slice(0, 3).map((item) => (
            <Card
              key={item.id}
              padded={false}
              className="
                group
                flex w-full min-w-0 basis-full shrink-0 snap-center flex-col
                overflow-hidden rounded-md
                border-border/70 shadow-sm
                transition-transform duration-200
                hover:-translate-y-1 active:scale-[0.99]
                sm:basis-75 sm:max-w-75 sm:flex-none
              "
            >
              <div className="relative h-40 w-full overflow-hidden">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="
                      object-cover
                      transition-transform duration-300
                      group-hover:scale-[1.02]
                    "
                  />
                )}
              </div>

              <div className="flex flex-1 flex-col p-4">
                <span className="flex items-center gap-1.5 text-xs font-medium text-primary-600">
                  <FaCalendarAlt
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                  {item.date}
                </span>

                <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-5 text-foreground">
                  {item.title}
                </h3>

                <p className="mt-1 line-clamp-2 text-xs leading-5 text-foreground-muted">
                  {item.description ?? item.location}
                </p>

                {item.href && (
                  <Link
                    href={item.href}
                    className="
                      mt-auto pt-3
                      text-xs font-semibold text-primary-600
                      transition-colors hover:text-primary-700
                    "
                  >
                    Baca Selengkapnya →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        {upcomingAgenda.length > 1 && (
          <div className="flex items-center gap-1.5 sm:hidden">
            {upcomingAgenda.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goToSlide(index)}
                aria-label={`Kegiatan ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  activeIndex === index
                    ? "w-6 bg-primary-600"
                    : "w-1.5 bg-border"
                }`}
              />
            ))}
          </div>
        )}

        <Button href="/agenda" size="medium">
          Lihat Semua Kegiatan →
        </Button>
      </Container>
    </Section>
  );
}
