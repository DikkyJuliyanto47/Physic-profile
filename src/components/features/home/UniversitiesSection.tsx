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
    if (!selectedUniversity) {
      return;
    }

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
    <Section tone="muted" className="relative overflow-hidden py-16 lg:py-20">
      <Container className="flex flex-col items-center gap-8">
        <div className="text-center">
          <SectionHeading
          eyebrow="Perguruan Tinggi"
          title="Perguruan Tinggi Anggota PSI Cabang Surabaya"
          align="center"
        />
        </div>

        <div className="w-full max-w-6xl">
          <div
            className="
              rounded-3xl
              bg-primary-500
              px-6 py-8
              shadow-[0_14px_32px_rgba(29,92,184,0.14)]
              sm:px-8 sm:py-9
              lg:px-10 lg:py-10
            "
          >
            <div
              className="
                grid
                grid-cols-2
                items-center
                justify-items-center
                gap-x-6
                gap-y-8
                sm:grid-cols-3
                sm:gap-x-8
                lg:grid-cols-5
                lg:gap-x-6
                lg:gap-y-4
              "
            >
              {universities.map((university) => {
                const content = (
                  <div
                    className="
                      group
                      flex
                      min-h-28
                      w-full
                      flex-col
                      items-center
                      justify-center
                      px-2
                      text-center
                      transition-transform
                      duration-300
                      ease-out
                      motion-safe:group-hover:-translate-y-1
                    "
                  >
                    <div
                      className="
                        flex
                        h-16 w-16
                        items-center justify-center
                        sm:h-20 sm:w-20
                      "
                    >
                      <Image
                        src={university.logo}
                        alt={university.name}
                        width={80}
                        height={80}
                        className="
                          h-full
                          w-full
                          object-contain
                          transition-transform
                          duration-300
                          ease-out
                          motion-safe:group-hover:scale-[1.04]
                        "
                      />
                    </div>

                    <p
                      className="
                        mt-3
                        max-w-32
                        text-center
                        text-xs
                        font-semibold
                        leading-4
                        text-white
                        sm:text-sm
                        sm:leading-5
                      "
                    >
                      {university.name}
                    </p>
                  </div>
                );

                if (university.options?.length) {
                  return (
                    <button
                      key={university.id}
                      type="button"
                      onClick={() => setSelectedUniversity(university)}
                      className="
                        w-full
                        rounded-xl
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-white/80
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-primary-500
                      "
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
                      className="
                        w-full
                        rounded-xl
                        outline-none
                        focus-visible:ring-2
                        focus-visible:ring-white/80
                        focus-visible:ring-offset-2
                        focus-visible:ring-offset-primary-500
                      "
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <div key={university.id} className="w-full">
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
          className="
            fixed inset-0 z-50
            flex items-center justify-center
            bg-slate-950/35
            px-4
            backdrop-blur-sm
          "
          role="presentation"
          onClick={() => setSelectedUniversity(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="university-dialog-title"
            className="
              w-full max-w-md
              overflow-hidden
              rounded-[1.125rem]
              border border-white/80
              bg-white
              shadow-[0_24px_60px_rgba(15,23,42,0.18)]
              animate-in
              fade-in
              zoom-in-[0.98]
              duration-200
            "
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-6 px-6 pb-4 pt-6">
              <div>
                <h3
                  id="university-dialog-title"
                  className="
                    text-lg
                    font-bold
                    tracking-tight
                    text-foreground
                  "
                >
                  {selectedUniversity.name}
                </h3>

                <p className="mt-1.5 text-sm text-foreground-muted">
                  Pilih program studi
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedUniversity(null)}
                aria-label="Tutup dialog"
                className="
                  flex h-9 w-9
                  shrink-0
                  items-center justify-center
                  rounded-lg
                  text-foreground-muted
                  transition-colors
                  hover:bg-background-muted
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-primary-300
                "
              >
                <span aria-hidden="true" className="text-lg leading-none">
                  ×
                </span>
              </button>
            </div>

            <div className="space-y-2 border-t border-border/70 px-6 py-5">
              {selectedUniversity.options?.map((option) => (
                <Link
                  key={option.href}
                  href={option.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    flex min-h-12
                    items-center justify-between
                    gap-4
                    rounded-lg
                    border border-border
                    px-4
                    text-sm font-medium
                    text-foreground
                    transition-[background-color,border-color,color,transform]
                    duration-200
                    hover:-translate-y-px
                    hover:border-primary-200
                    hover:bg-primary-50
                    hover:text-primary-700
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-primary-300
                  "
                >
                  <span>{option.label}</span>
                  <span
                    aria-hidden="true"
                    className="text-primary-600"
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