/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 13:00:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 13:00:00
 */

import { Container, Section, PageBreadcrumb, PageHeader } from "@/components/ui";
import {
  NewsGrid,
  LatestNewsWidget,
  AgendaWidget,
  CategoryWidget,
  latestNews,
} from "@/components/features/news";

export default function BeritaPage() {
  return (
    <Section className="pt-10 lg:pt-12">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_320px] lg:items-start lg:gap-12">
          <div className="flex flex-col gap-8">
            <PageBreadcrumb
              items={[
                { label: "Beranda", href: "/" },
                { label: "Berita" },
              ]}
            />

            <PageHeader
              eyebrow="INFORMASI"
              title="Berita PSI Cabang Surabaya"
            />

            <NewsGrid items={latestNews} />
          </div>

          <aside className="flex flex-col gap-8 self-start lg:-mt-104 lg:sticky lg:top-24">
            <LatestNewsWidget items={latestNews} />
            <AgendaWidget />
            <CategoryWidget />
          </aside>
        </div>
      </Container>
    </Section>
  );
}