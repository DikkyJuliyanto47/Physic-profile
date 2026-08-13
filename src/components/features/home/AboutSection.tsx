/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 08:20:54
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 10:00:00
 */

import { Button, Container, Section } from "@/components/ui";
import { StatisticsSection } from "./StatisticsSection";

export function AboutSection() {
  return (
    <Section padding="compact">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div className="max-w-3xl">
            <div className="flex w-full flex-col gap-3">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                Tentang Kami
              </span>

              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Sekilas tentang PSI Cabang Surabaya
              </h2>
            </div>

            <p className="mt-6 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
              Physical Society of Indonesia Cabang Surabaya merupakan wadah
              kolaborasi akademisi, peneliti, dan pendidik fisika untuk
              membangun jejaring keilmuan serta mendorong perkembangan
              pendidikan dan penelitian fisika.
            </p>

            <div className="mt-8">
              <Button
                href="/tentang"
                variant="outline"
                size="large"
                className="border-border px-6 py-3.5 text-base sm:px-7 sm:py-4 sm:text-lg"
              >
                Selengkapnya →
              </Button>
            </div>
          </div>

          <StatisticsSection variant="inline" />
        </div>
      </Container>
    </Section>
  );
}