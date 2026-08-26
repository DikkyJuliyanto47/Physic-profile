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
  getNews,
} from "@/components/features/news";

export default async function BeritaPage() {
  const news = await getNews({ limit: 10 });
  const [featuredNews, ...archiveNews] = news;

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
              <h2 className="text-2xl font-semibold tracking-tight text-primary-950 sm:text-3xl">
                Semua Berita
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
                Informasi dan perkembangan terbaru dari PSI Cabang Surabaya.
              </p>
            </div>

            <NewsSearch />
            <CategoryWidget />
            <NewsList items={archiveNews} />
          </section>
        </div>
      </Container>
    </Section>
  );
}