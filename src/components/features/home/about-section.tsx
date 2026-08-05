/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 08:20:54 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:35:39
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Container, Section, SectionHeading } from "@/components/ui/index";
import { aboutHighlights, galleryImages } from "./data";

export function AboutSection() {
  const [galleryIndex, setGalleryIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Maju ke gambar berikutnya
  const nextGallery = (): void => {
    setGalleryIndex((prev: number) => (prev + 1) % galleryImages.length);
  };

  // Mundur ke gambar sebelumnya
  const prevGallery = (): void => {
    setGalleryIndex((prev: number) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleTouchStart = (e: React.TouchEvent): void => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent): void => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  // Hitung jarak geser,
  const handleTouchEnd = (): void => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      nextGallery();
    } else if (distance < -50) {
      prevGallery();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  // Pergantian gambar otomatis setiap 4 detik
  useEffect(() => {
    intervalRef.current = setInterval(nextGallery, 4000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Reset timer otomatis saat user mengklik dot navigasi
  const handleDotClick = (index: number): void => {
    setGalleryIndex(index);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(nextGallery, 4000);
    }
  };

  const latestImages = galleryImages.slice(0, 3);
  const currentImage = latestImages[galleryIndex];
  return (
    <Section>
      <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
        <div className="flex flex-col gap-6">
          <SectionHeading
            eyebrow="Tentang Kami"
            title="Sekilas tentang PSI Cabang Surabaya"
          />

          <p className="text-foreground-muted">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur.
          </p>

          <div className="grid gap-4 sm:grid-cols-3">
            {aboutHighlights.map((highlight) => (
              <div
                key={highlight.id}
                className="flex flex-col gap-2 rounded-lg bg-muted p-4 transition hover:shadow-md"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary-600 text-white">
                  <span className="text-xl font-bold">
                    {highlight.title.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {highlight.title}
                </span>
                <span className="text-xs text-foreground-muted">
                  {highlight.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-md">
            <div
              className="relative flex h-72 w-full items-center justify-center overflow-hidden rounded-2xl"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div className="relative h-[80%] w-[85%]">
                <div
                  className="absolute left-0 top-0 h-full w-full rounded-xl bg-[#7ba3ef]"
                  style={{
                    transform: "rotate(-1deg) translate(10px, 10px)",
                  }}
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImage.id}
                    className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-xl bg-[#3572e4] text-2xl font-bold text-white shadow-xl"
                    style={{
                      transform: "rotate(-2deg)",
                      zIndex: 10,
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.02, rotate: "-1deg" }}
                  >
                    <div className="p-4 text-center">
                      <span className="mb-2 block text-4xl">
                        {currentImage.label}
                      </span>
                      <span className="text-sm font-normal opacity-90">
                        PSI Surabaya
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {latestImages.length > 1 && (
              <div className="absolute -bottom-6 left-1/2 flex -translate-x-1/2 gap-1.5">
                {latestImages.map((_, index: number) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleDotClick(index)}
                    aria-label={`Gallery ${index + 1}`}
                    className={`h-2 rounded-full transition ${
                      galleryIndex === index
                        ? "w-6 bg-primary-600"
                        : "w-2 bg-neutral-300"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}