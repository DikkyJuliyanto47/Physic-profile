"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container, Section } from "@/components/ui";
import { galleryItems } from "./data";

// Gradient fallback dipakai saat item belum memiliki asset foto
const FALLBACK_GRADIENTS = [
  "from-primary-700 via-primary-600 to-primary-800",
  "from-primary-800 via-primary-700 to-primary-900",
  "from-primary-900 via-primary-700 to-primary-600",
];

export function GallerySection() {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const next = () => {
    setCurrent((prev) => (prev + 1) % galleryItems.length);
  };

  const prev = () => {
    setCurrent((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1));
  };

  const goTo = (index: number) => {
    setCurrent(index);
  };

  // Auto-rotate, berhenti sementara saat hover/di-hover pointer
  useEffect(() => {
    if (isPaused || galleryItems.length <= 1) return;
    timerRef.current = setInterval(next, 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchEnd(null);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (): void => {
    if (touchStart === null || touchEnd === null) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) next();
    else if (distance < -50) prev();
    setTouchStart(null);
    setTouchEnd(null);
  };

  const item = galleryItems[current];

  return (
    <Section tone="muted" padding="none" className="overflow-hidden">
      <div
        className="relative w-full"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative h-80 w-full overflow-hidden sm:h-100 md:h-115 lg:h-130 xl:h-140">
          {galleryItems.map((galleryItem, index) => (
            <div
              key={galleryItem.id}
              aria-hidden={index !== current}
              className={`absolute inset-0 transition-opacity duration-700 ease-out ${
                index === current ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {galleryItem.image ? (
                <Image
                  src={galleryItem.image}
                  alt={galleryItem.title ?? galleryItem.caption}
                  fill
                  priority={index === 0}
                  sizes="100vw"
                  className="object-cover object-center"
                />
              ) : (
                <div
                  className={`h-full w-full bg-linear-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]}`}
                />
              )}

              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-black/0" />
            </div>
          ))}

          <div className="absolute inset-x-0 bottom-0 z-10">
            <Container className="pb-8 pt-16 sm:pb-10 md:pb-12">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white backdrop-blur-sm sm:text-sm">
                  {item.date}
                </span>
                {item.title && (
                  <span className="inline-block rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white sm:text-sm">
                    Kegiatan Terkini
                  </span>
                )}
              </div>

              <p className="mt-3 max-w-2xl text-lg font-semibold leading-snug text-white sm:text-xl md:text-2xl">
                {item.title ?? item.caption}
              </p>

              {item.title && (
                <p className="mt-1.5 max-w-xl line-clamp-2 text-sm leading-6 text-white/80 sm:text-base">
                  {item.caption}
                </p>
              )}

              {item.href && (
                <Link
                  href={item.href}
                  className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-white/90 hover:text-white"
                >
                  Lihat Selengkapnya
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              )}
            </Container>
          </div>

          <button
            type="button"
            onClick={prev}
            aria-label="Sebelumnya"
            disabled={galleryItems.length <= 1}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:left-6 sm:h-11 sm:w-11"
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

          <button
            type="button"
            onClick={next}
            aria-label="Berikutnya"
            disabled={galleryItems.length <= 1}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 sm:right-6 sm:h-11 sm:w-11"
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

          {galleryItems.length > 1 && (
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 sm:bottom-6 sm:right-8">
              {galleryItems.map((galleryItem, index) => (
                <button
                  key={galleryItem.id}
                  type="button"
                  onClick={() => goTo(index)}
                  aria-label={`Slide ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    current === index ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}