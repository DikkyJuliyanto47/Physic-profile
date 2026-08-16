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
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatPublishedAt(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(date);
}

export default async function RisetPublikasiPage() {
  const now = new Date();
  const [latestNews, publications] = await Promise.all([
    getLatestNews(),
    prisma.publication.findMany({
      where: { publishedAt: { not: null, lte: now } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  const publicationItems = publications.map((publication) => ({
    id: publication.id,
    category: publication.type,
    title: publication.title,
    meta: [
      publication.description,
      publication.publishedAt ? formatPublishedAt(publication.publishedAt) : null,
    ].filter((item): item is string => Boolean(item)),
    href: publication.externalUrl ?? publication.fileUrl,
  }));

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

              <ResearchPublicationSection publications={publicationItems} />
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
