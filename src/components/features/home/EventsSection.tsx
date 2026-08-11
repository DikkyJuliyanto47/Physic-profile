/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:11:53 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-02 09:11:53 
 */

import Image from "next/image";
import Link from "next/link";
import { Card, Container, Section, SectionHeading } from "@/components/ui/index";
import { upcomingAgenda } from "./data";

const FALLBACK_GRADIENTS = [
  "from-primary-600 to-primary-800",
  "from-primary-700 to-primary-900",
  "from-primary-800 to-primary-950",
];

export function EventsSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <div className="border-t border-border pt-8">
          <SectionHeading
            eyebrow="Agenda Kegiatan"
            title="Agenda Terdekat"
            action={
              <Link
                href="/kegiatan"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Lihat Semua Kegiatan →
              </Link>
            }
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {upcomingAgenda.map((item, index) => (
            <Card
              key={item.id}
              padded={false}
              className="flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40 w-full">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-full w-full items-center justify-center bg-linear-to-br ${
                      FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-white/70"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                  {item.date}
                  {item.time ? ` • ${item.time}` : ""}
                </span>

                <h3 className="text-base font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>

                <div className="flex items-center gap-1.5 text-sm text-foreground-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="line-clamp-1">{item.location}</span>
                </div>

                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-auto pt-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Lihat Detail →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}