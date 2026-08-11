/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 09:16:31
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 13:00:00
 */

import Image from "next/image";
import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui/index";
import { universities } from "./data";

export function UniversitiesSection() {
  // Duplikasi list agar animasi marquee dapat berjalan.
  const track = [...universities, ...universities];

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <SectionHeading
              eyebrow="PERGURUAN TINGGI"
              title="Perguruan Tinggi Anggota"
            />
          </div>

          <Link
            href="/perguruan-tinggi"
            className="shrink-0 whitespace-nowrap text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            Lihat Semua Perguruan Tinggi →
          </Link>
        </div>

        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-28" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent sm:w-28" />

          <div className="university-marquee flex w-max items-center gap-14 py-2 sm:gap-20">
            {track.map((university, index) => (
              <div
                key={`${university.id}-${index}`}
                className="flex h-14 w-28 shrink-0 items-center justify-center grayscale transition duration-300 hover:grayscale-0 sm:h-16 sm:w-32"
              >
                <Image
                  src={university.logo}
                  alt={university.name}
                  width={160}
                  height={80}
                  className="h-full w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .university-marquee {
            animation: university-marquee-scroll 32s linear infinite;
          }

          .university-marquee:hover {
            animation-play-state: paused;
          }

          @keyframes university-marquee-scroll {
            from {
              transform: translateX(0);
            }

            to {
              transform: translateX(-50%);
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .university-marquee {
              animation: none;
            }
          }
        `}</style>
      </Container>
    </Section>
  );
}