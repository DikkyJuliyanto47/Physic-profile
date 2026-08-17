// page.tsx
/*
 * @Author: galhkoernia
 * @Date: 2026-08-08 11:05:21
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 15:20:00
 */

import { Container, Section, PageBreadcrumb } from "@/components/ui";
import { ResearchPublicationSection } from "@/components/features/research";
import { JoinCtaSection } from "@/components/features/home";
import {
  LatestNewsWidget,
  AgendaWidget,
  CategoryWidget,
  getLatestNews,
} from "@/components/features/news";
import { getPublishedPublications } from "@/components/features/research/data";

export const dynamic = "force-dynamic";

export default async function RisetPublikasiPage() {
  const [latestNews, publications] = await Promise.all([
    getLatestNews(),
    getPublishedPublications(),
  ]);

  return (
    <>
      <Section padding="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start lg:gap-12">
            <div className="flex flex-col gap-8">
              <PageBreadcrumb
                items={[
                  { label: "Beranda", href: "/" },
                  { label: "Penelitian & Publikasi" },
                ]}
              />

              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
                  PENELITIAN & PUBLIKASI
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Pusat Penelitian dan Publikasi
                </h1>

                <p className="mt-5 text-lg leading-8 text-foreground-muted">
                  Pusat informasi penelitian, publikasi ilmiah, HKI, buku,
                  prosiding, dan kolaborasi penelitian anggota PSI.
                </p>
              </div>

              <ResearchPublicationSection publications={publications} />
            </div>

            <aside className="flex flex-col gap-8 self-start lg:sticky lg:top-24">
              <LatestNewsWidget items={latestNews} />
              <AgendaWidget />
              <CategoryWidget />
            </aside>
          </div>
        </Container>
      </Section>

      <JoinCtaSection />
    </>
  );
}
