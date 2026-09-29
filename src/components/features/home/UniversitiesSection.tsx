"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Container, SectionHeading } from "@/components/ui";

export type UniversityItem = {
  id: string;
  name: string;
  logoUrl: string | null;
  deptUrl: string | null;
  websiteUrl: string | null;
};

interface UniversitiesSectionProps {
  universities: UniversityItem[];
}

export function UniversitiesSection({
  universities,
}: UniversitiesSectionProps) {
  const [selectedUniversity, setSelectedUniversity] =
    useState<UniversityItem | null>(null);

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
    <>
    
      <section className="bg-white py-8 sm:py-10 lg:py-12">
        <Container>
          
          <div className="relative overflow-hidden rounded-lg bg-primary-950 px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-10 lg:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,0.025),transparent_48%,rgba(37,99,235,0.06))]"
            />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/4"
            />

            <div className="relative">
              
              <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
                <SectionHeading
                  eyebrow="Perguruan Tinggi"
                  title="Perguruan Tinggi Anggota PSI Cabang Surabaya"
                  align="center"
                  className="[&_h2]:max-w-4xl [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-[1.15] [&_h2]:tracking-tight [&_h2]:text-white sm:[&_h2]:text-3xl lg:[&_h2]:text-4xl [&_p]:text-white/65 [&_span]:text-primary-300"
                />
              </div>

              <div className="mx-auto mt-7 h-px w-full max-w-5xl bg-white/15 sm:mt-8" />

              <div className="mx-auto mt-5 w-full max-w-5xl sm:mt-6">
                <div className="flex flex-wrap justify-center">
                  {universities.map((university) => {
                    const hasDeptUrl = Boolean(university.deptUrl);
                    const hasWebsiteUrl = Boolean(university.websiteUrl);

                    const hasMultipleLinks =
                      hasDeptUrl && hasWebsiteUrl;

                    const content = (
                      <div className="flex min-h-32 w-full flex-col items-center justify-center px-3 py-5 sm:min-h-36 sm:px-4 sm:py-6 lg:min-h-40">
                        {/* Logo */}
                        <div className="flex h-16 w-16 items-center justify-center sm:h-18 sm:w-18 lg:h-20 lg:w-20">
                          {university.logoUrl ? (
                            <Image
                              src={university.logoUrl}
                              alt={university.name}
                              width={80}
                              height={80}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center border border-white/15 text-xs text-white/50">
                              Logo
                            </div>
                          )}
                        </div>

                        <p className="mt-4 max-w-40 text-center text-xs font-medium leading-5 text-white/85 sm:text-sm">
                          {university.name}
                        </p>
                      </div>
                    );

                    const itemClassName =
                      "w-1/2 rounded-md outline-none transition-colors " +
                      "hover:bg-white/[0.045] " +
                      "focus-visible:bg-white/[0.05] " +
                      "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-300 " +
                      "sm:w-1/3 lg:w-1/5";

                    if (hasMultipleLinks) {
                      return (
                        <button
                          key={university.id}
                          type="button"
                          onClick={() =>
                            setSelectedUniversity(university)
                          }
                          className={itemClassName}
                          aria-label={`Pilih informasi ${university.name}`}
                        >
                          {content}
                        </button>
                      );
                    }

                    const href =
                      university.deptUrl ?? university.websiteUrl;

                    if (href) {
                      return (
                        <Link
                          key={university.id}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={itemClassName}
                        >
                          {content}
                        </Link>
                      );
                    }

                    return (
                      <div
                        key={university.id}
                        className={itemClassName}
                      >
                        {content}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

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
                  className="mt-1.5 text-lg font-bold leading-tight tracking-tight sm:text-xl"
                >
                  {selectedUniversity.name}
                </h3>

                <p className="mt-1 text-sm text-foreground-muted">
                  Pilih informasi
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
              {selectedUniversity.deptUrl && (
                <Link
                  href={selectedUniversity.deptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-4 border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <span>Program Studi / Departemen</span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-primary-600"
                  >
                    →
                  </span>
                </Link>
              )}

              {selectedUniversity.websiteUrl && (
                <Link
                  href={selectedUniversity.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex min-h-12 items-center justify-between gap-4 border border-border px-4 text-sm font-medium text-foreground transition-colors hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
                >
                  <span>Website Universitas</span>

                  <span
                    aria-hidden="true"
                    className="shrink-0 text-primary-600"
                  >
                    →
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}