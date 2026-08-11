/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 08:20:54
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 21:00:00
 */

import { FaBullseye, FaEye } from "react-icons/fa";
import { Container, Section, SectionHeading } from "@/components/ui";

export function AboutSection() {
  return (
    <Section>
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="max-w-2xl">
            <SectionHeading
              eyebrow="Tentang Kami"
              title="Sekilas tentang PSI Cabang Surabaya"
            />

            <p className="mt-6 max-w-xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
              Physical Society of Indonesia Cabang Surabaya merupakan wadah
              kolaborasi akademisi, peneliti, dan pendidik fisika untuk
              membangun jejaring keilmuan serta mendorong perkembangan
              pendidikan dan penelitian fisika.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="group rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                  <FaEye className="h-4.5 w-4.5" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-6 text-foreground">
                    Visi
                  </h3>

                  <p className="mt-2.5 text-sm leading-6 text-foreground-muted sm:text-[15px] sm:leading-6">
                    Menjadi wadah kolaborasi fisika yang aktif, inklusif, dan
                    berkontribusi dalam pengembangan keilmuan serta pendidikan
                    fisika.
                  </p>
                </div>
              </div>
            </div>

            <div className="group rounded-2xl border border-border bg-background p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm">
                  <FaBullseye className="h-4.5 w-4.5" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold leading-6 text-foreground">
                    Misi
                  </h3>

                  <p className="mt-2.5 text-sm leading-6 text-foreground-muted sm:text-[15px] sm:leading-6">
                    Membangun jejaring, memperkuat kolaborasi, serta mendorong
                    kegiatan pendidikan, penelitian, dan pengabdian di bidang
                    fisika.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}