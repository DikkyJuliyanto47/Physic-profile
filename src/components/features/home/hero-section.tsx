/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 07:49:09 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 10:00:35
 */

import { Button, Container, Section } from "@/components/ui/index";
import { LatestNewsPanel } from "./latest-news-panel";

export function HeroSection() {
  return (
    <Section
      tone="muted"
      className="min-h-[calc(100vh-80px)] flex items-center"
    >
      <Container
        className="
          grid
          gap-16
          lg:grid-cols-[72%_28%]
          items-center
        "
      >
        <div className="max-w-4xl">
          <span className="text-base font-semibold tracking-wide text-primary-600">
            Physical Society of Indonesia
          </span>

          <h1
            className="
              mt-5
              text-5xl
              font-bold
              leading-[1.05]
              tracking-tight
              text-foreground
              lg:text-6xl
              xl:text-7xl
            "
          >
            Menghubungkan Komunitas Fisika di Surabaya &amp; Jawa Timur
          </h1>

          <p
            className="
              mt-8
              max-w-2xl
              text-lg
              leading-8
              text-foreground-muted
            "
          >
            Wadah kolaborasi akademisi, peneliti, dan pendidik fisika dari
            perguruan tinggi di wilayah Surabaya untuk pengembangan keilmuan,
            pendidikan, dan penelitian fisika.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href="/kontak">
              Gabung sebagai Anggota
            </Button>

            <Button
              href="/tentang"
              variant="outline"
            >
              Tentang Kami
            </Button>
          </div>
        </div>

        <LatestNewsPanel />
      </Container>
    </Section>
  );
}