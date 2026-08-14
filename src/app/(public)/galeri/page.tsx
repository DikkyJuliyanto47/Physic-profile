/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 15:00:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 15:00:00
 */

import { Container, Section, PageBreadcrumb } from "@/components/ui";
import { JoinCtaSection } from "@/components/features/home";
import {
  LatestNewsWidget,
  AgendaWidget,
  CategoryWidget,
  latestNews,
} from "@/components/features/news";
import {
  DocumentationGrid,
  GalleryContributionCta,
} from "@/components/features/gallery";
import { documentationItems } from "@/components/features/gallery/data";

export default function GaleriPage() {
  return (
    <>
      <Section padding="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start lg:gap-12">
            <div className="flex flex-col gap-8">
              <PageBreadcrumb
                items={[{ label: "Beranda", href: "/" }, { label: "Galeri" }]}
              />

              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
                  DOKUMENTASI PSI CABANG SURABAYA
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Dokumentasi Kegiatan PSI Cabang Surabaya
                </h1>

                <p className="mt-5 text-lg leading-8 text-foreground-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna
                  aliqua.
                </p>
              </div>

              <DocumentationGrid items={documentationItems} />
            </div>

            <aside className="flex flex-col gap-8 self-start lg:sticky lg:top-24">
              <LatestNewsWidget items={latestNews} />
              <AgendaWidget />
              <CategoryWidget />
            </aside>
          </div>
        </Container>
      </Section>

      <GalleryContributionCta />
      <JoinCtaSection />
    </>
  );
}