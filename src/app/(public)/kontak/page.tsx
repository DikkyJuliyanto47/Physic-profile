/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 15:30:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 15:30:00
 */

import { Container, Section, PageBreadcrumb } from "@/components/ui";
import {
  ConnectSection,
  CollaborationCta,
  LocationSection,
} from "@/components/features/contact";

export default function KontakPage() {
  return (
    <>
      <Section padding="compact">
        <Container className="flex flex-col gap-4">
          <PageBreadcrumb
            items={[{ label: "Beranda", href: "/" }, { label: "Kontak" }]}
          />

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
              HUBUNGI KAMI
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Terhubung dengan PSI Surabaya
            </h1>

            <p className="mt-5 text-lg leading-8 text-foreground-muted">
              Ada pertanyaan, undangan kegiatan, atau ide kolaborasi? Silakan
              hubungi kami melalui salah satu kanal di bawah ini.
            </p>
          </div>
        </Container>
      </Section>

      <ConnectSection />
      <CollaborationCta />
      <LocationSection />
    </>
  );
}