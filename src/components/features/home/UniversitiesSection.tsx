/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 09:16:31
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 10:00:00
 */

import Image from "next/image";

import { Container, Section, SectionHeading } from "@/components/ui/index";
import { universities } from "./data";

export function UniversitiesSection() {
  const track = [...universities, ...universities];

  return (
    <Section>
      <Container className="flex flex-col items-center gap-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="PERGURUAN TINGGI"
            title="Perguruan Tinggi Anggota"
            align="center"
          />

          <div className="mx-auto mt-3 h-0.5 w-16 bg-primary-600" />
        </div>

        <div className="relative mt-10 overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-linear-to-r from-background to-transparent sm:w-28" />

          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-linear-to-l from-background to-transparent sm:w-28" />

          <div className="university-marquee flex w-max items-center gap-14 py-2 sm:gap-20">
            {track.map((university, index) => (
              <div
                key={`${university.id}-${index}`}
                className="flex shrink-0 items-center gap-3"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center sm:h-16 sm:w-16">
                  <Image
                    src={university.logo}
                    alt={university.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </div>

                <span className="max-w-36 text-sm font-semibold leading-tight text-foreground">
                  {university.name}
                </span>
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