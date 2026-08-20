"use client"

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Container, Section, SectionHeading } from "@/components/ui";
import { universities  } from "./data";
import type { University } from "./data";

export function UniversitiesSection() {

  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null);

  return (
    <Section tone="muted" className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-20 h-64 w-64 rounded-full bg-primary-300/20 blur-3xl" />
        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-primary-400/15 blur-3xl" />
      </div>
      <Container className="flex flex-col items-center gap-6">
        <div className="text-center">
          <SectionHeading
            eyebrow="PERGURUAN TINGGI"
            title="Perguruan Tinggi Anggota PSI Cabang Surabaya"
            align="center"
          />
          <div className="mx-auto mt-3 h-0.5 w-16 bg-primary-600" />
        </div>

        <div className="mt-6 w-full">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {universities.map((university) => {
              const content = (
                <div className="group flex h-full flex-col items-center rounded-md p-2 transition-colors duration-200">
                  <div className="flex h-16 w-16 items-center justify-center sm:h-20 sm:w-20">
                    <Image
                      src={university.logo}
                      alt={university.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain transition-opacity duration-200 group-hover:opacity-90"
                    />
                  </div>

                  <p className="mt-2 text-center text-xs font-medium leading-relaxed text-neutral-700 sm:text-sm">
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
                    className="block h-full text-left"
                  >
                    {content}
                  </button>
                );
              }

              return university.href ? (
                <Link
                  key={university.id}
                  href={university.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  {content}
                </Link>
              ) : (
                <div key={university.id} className="h-full">
                  {content}
                </div>
              );
            })}
          </div>
        </div>

        {selectedUniversity && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4"
            onClick={() => setSelectedUniversity(null)}
          >
            <div
              className="w-full max-w-sm border border-neutral-200 bg-white p-5 rounded-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {selectedUniversity.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    Pilih program studi
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedUniversity(null)}
                  className="text-neutral-500 hover:text-neutral-800"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {selectedUniversity.options?.map((option) => (
                  <Link
                    key={option.href}
                    href={option.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-neutral-200 px-4 py-3 text-sm hover:bg-neutral-50"
                  >
                    {option.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </Container>
    </Section>
  );
}