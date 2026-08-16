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
                PSI Cabang Surabaya merupakan bagian dari Physical Society of Indonesia (PSI)
                yang menjadi wadah bagi insan fisika di wilayah Surabaya dan sekitarnya untuk
                membangun komunikasi, kolaborasi, serta pengembangan ilmu dan pendidikan
                fisika.
                <br />
                <br />
                Melalui berbagai kegiatan akademik dan keorganisasian, PSI Cabang Surabaya
                berupaya memperkuat jejaring antaranggota dan perguruan tinggi serta mendorong
                kontribusi insan fisika bagi perkembangan pendidikan, penelitian, dan
                masyarakat.
            </p>

            <div className="mt-8">
              <Button
                href="/about"
                variant="outline"
                size="large"
                className="border border-gray-400"
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
