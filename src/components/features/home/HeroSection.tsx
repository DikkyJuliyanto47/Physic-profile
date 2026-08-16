/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 07:49:09
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 11:00:00
 */

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaUserPlus } from "react-icons/fa";
import { Button, Container, Section } from "@/components/ui";
import { heroImages } from "./data";

export function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getImageIndex = (offset: number) => {
    return (activeIndex + offset) % heroImages.length;
  };

  return (
    <Section
      tone="muted"
      className="relative overflow-hidden py-16 lg:py-24"
    >
      <Container className="grid items-center gap-12 lg:grid-cols-[2.7fr_1.3fr] lg:gap-16">
        <div className="min-w-0 max-w-3xl">
          <span className="text-lg font-semibold tracking-wide text-primary-600 sm:text-xl">
            Physical Society of Indonesia
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-6xl xl:text-7xl">
            Menghubungkan Komunitas Fisika di Surabaya &amp; Jawa Timur
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-foreground-muted sm:text-xl sm:leading-9">
            Wadah kolaborasi akademisi, peneliti, dan pendidik fisika dari
            perguruan tinggi di wilayah Surabaya untuk pengembangan keilmuan,
            pendidikan, dan penelitian fisika.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/contact" size="large" icon={<FaUserPlus />} iconPosition="right">
              Gabung sebagai anggota
            </Button>

            <Button href="/about" variant="outline" size="large">
              Pelajari Lebih Lanjut →
            </Button>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative aspect-4/5 w-full sm:aspect-4/3 lg:aspect-3/4">

            {[2, 1].map((offset) => {
              const image = heroImages[getImageIndex(offset)];

              return (
                <motion.div
                  key={`${image.id}-${offset}`}
                  className="absolute inset-0 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-lg"
                  initial={false}
                  animate={{
                    scale: 1 - offset * 0.035,
                    x: offset * 12,
                    y: offset * 10,
                    rotate: offset === 1 ? 2 : 4,
                    zIndex: 10 - offset,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 24,
                  }}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 384px, 100vw"
                    className="object-cover object-center"
                  />
                </motion.div>
              );
            })}

            <AnimatePresence initial={false} mode="popLayout">
              <motion.div
                key={heroImages[activeIndex].id}
                className="absolute inset-0 z-20 overflow-hidden rounded-2xl border-4 border-white bg-white shadow-xl"
                initial={{
                  x: -20,
                  y: 10,
                  rotate: -3,
                  scale: 0.98,
                  opacity: 0,
                }}
                animate={{
                  x: 0,
                  y: 0,
                  rotate: -2,
                  scale: 1,
                  opacity: 1,
                }}
                exit={{
                  x: 35,
                  y: 18,
                  rotate: 4,
                  scale: 0.96,
                  opacity: 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 24,
                }}
                whileHover={{
                  rotate: -0.5,
                  scale: 1.015,
                }}
              >
                <Image
                  src={heroImages[activeIndex].src}
                  alt={heroImages[activeIndex].alt}
                  fill
                  priority
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 384px, 100vw"
                  className="object-cover object-center"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Container>
    </Section>
  );
}
