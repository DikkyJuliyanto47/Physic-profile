import { getPublishedNews } from "@/lib/data";
import {
  Container,
  PageBreadcrumb,
  Section,
} from "@/components/ui";
import {
  CategoryWidget,
  FeaturedNews,
  NewsList,
  NewsSearch,
} from "@/components/features/news";

interface BeritaPageProps {
  searchParams: Promise<{
    kategori?: string;
  }>;
}

export default async function BeritaPage({
  searchParams,
}: BeritaPageProps) {
  const { kategori } = await searchParams;
  const newsItems = await getPublishedNews(kategori);

  const isFiltered = Boolean(kategori);

  const featuredNews = isFiltered ? undefined : newsItems[0];
  const archiveNews = isFiltered ? newsItems : newsItems.slice(1);

  return (
    <Section className="pt-10 lg:pt-12">
      <Container>
        <div className="flex flex-col gap-8">
          <PageBreadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Berita" },
            ]}
          />

          {featuredNews && <FeaturedNews item={featuredNews} />}

          <section className="flex flex-col gap-5 pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-primary-950 sm:text-3xl">
                Semua Berita
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
                Informasi dan perkembangan terbaru dari PSI Cabang Surabaya.
              </p>
            </div>

            <NewsSearch />

            <CategoryWidget activeCategory={kategori} />

            <NewsList items={archiveNews} />
          </section>
        </div>
      </Container>
    </Section>
  );
}
