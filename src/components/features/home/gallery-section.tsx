/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 09:04:55
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 09:09:45
 */

"use client";

import { useEffect, useState } from "react";

import { Container, Section } from "@/components/ui";
import { galleryItems } from "./data";

export function GallerySection() {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % galleryItems.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  useEffect(() => {
    const timer = setInterval(next, 5000);

    return () => clearInterval(timer);
  }, []);

  const item = galleryItems[current];

  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-foreground sm:text-3xl">
            Galeri
          </h2>

          <p className="text-primary-600">
            Dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        <div className="relative w-full max-w-3xl">
          <button
            type="button"
            onClick={prev}
            aria-label="Sebelumnya"
            className="absolute -left-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-primary-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={galleryItems.length <= 1}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="aspect-video w-full rounded-xl bg-neutral-200 transition-all duration-300" />

          <button
            type="button"
            onClick={next}
            aria-label="Berikutnya"
            className="absolute -right-5 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-primary-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={galleryItems.length <= 1}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor" 
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Indikator Dot */}
        <div className="flex items-center gap-2">
          {galleryItems.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Gallery ${index + 1}`}
              className={`h-2 w-2 rounded-full transition ${
                current === index ? "bg-primary-600 w-4" : "bg-neutral-300"
              }`}
            />
          ))}
        </div>

        {/* Caption */}
        <span className="text-sm font-semibold text-primary-600">
          {item.date}
        </span>

        <p className="max-w-xl text-sm text-foreground-muted">
          {item.caption}
        </p>
      </Container>
    </Section>
  );
}