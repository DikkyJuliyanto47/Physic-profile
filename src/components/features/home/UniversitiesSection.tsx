"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui";
import { universities } from "./data";
import type { University } from "./data";

export function UniversitiesSection() {
  const [selectedUniversity, setSelectedUniversity] =
    useState<University | null>(null);

  useEffect(() => {
    if (!selectedUniversity) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedUniversity(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedUniversity]);

  return (
    <Section
      className="bg-primary-950 py-14 text-white sm:py-16 lg:py-20"
    >
      <Container>
        <div className="flex flex-col">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <SectionHeading
              eyebrow="Perguruan Tinggi"
              title="Perguruan Tinggi Anggota PSI Cabang Surabaya"
              align="center"
              className="[&_h2]:max-w-4xl [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-tight [&_h2]:text-white sm:[&_h2]:text-4xl [&_p]:text-white/65 [&_span]:text-primary-300"
            />
          </div>

          <div className="mx-auto mt-8 w-full max-w-5xl border-t border-white/20 pt-8 sm:mt-9 sm:pt-9 lg:mt-10 lg:pt-10">
            <div className="flex flex-wrap justify-center">
              {universities.map((university) => {
                const content = (
                  <div className="flex min-h-36 w-full flex-col items-center justify-center px-3 py-6 sm:min-h-40 sm:px-4 sm:py-7 lg:min-h-44 lg:px-5">
                    <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20 lg:h-22 lg:w-22">
                      <Image
                        src={university.logo}
                        alt={university.name}
                        width={88}
                        height={88}
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <p className="mt-4 max-w-40 text-center text-xs font-medium leading-5 text-white/90 sm:text-sm">
                      {university.name}
                    </p>
                  </div>
                );

                const itemClassName =
                  "w-1/2 sm:w-1/3 lg:w-1/5 outline-none transition-colors hover:bg-white/[0.035] focus-visible:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-300";

                if (university.options?.length) {
                  return (
                    <button
                      key={university.id}
                      type="button"
                      onClick={() => setSelectedUniversity(university)}
                      className={itemClassName}
                      aria-label={`Pilih program studi ${university.name}`}
                    >
                      {content}
                    </button>
                  );
                }

                if (university.href) {
                  return (
                    <Link
                      key={university.id}
                      href={university.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={itemClassName}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={university.id} className={itemClassName}>
                    {content}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>

      {selectedUniversity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary-950/60 px-4"
          role="presentation"
          onClick={() => setSelectedUniversity(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="university-dialog-title"
            className="w-full max-w-md border border-border bg-white text-foreground shadow-[0_20px_50px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 border-b border-border px-6 py-5 sm:px-7">
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600">
                  Perguruan Tinggi
                </p>

                <h3
                  id="university-dialog-title"
                  className="mt-1.5 text-lg font-bold leading-6 tracking-tight sm:text-xl"
                >
                  {selectedUniversity.name}
                </h3>

                <p className="mt-1 text-sm text-foreground-muted">
                  Pilih program studi
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUniversity(null)}
                aria-label="Tutup dialog"
                className="flex h-8 w-8 shrink-0 items-center justify-center border border-border text-lg leading-none text-foreground-muted transition-colors hover:bg-background-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-2 px-6 py-5 sm:px-7">
              {selectedUniversity.options?.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-4 border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <span>{option.label}</span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-primary-600"
                  >
                    →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}