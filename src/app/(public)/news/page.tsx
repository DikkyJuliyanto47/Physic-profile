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
import type { NewsItem } from "@/components/features/news";

const dummyNews: NewsItem[] = [
  {
    id: "news-1",
    title: "PSI Cabang Surabaya Perkuat Kolaborasi Akademik dan Keilmuan",
    date: "26 Agustus 2026",
    excerpt:
      "PSI Cabang Surabaya terus memperkuat komunikasi dan kolaborasi antaranggota melalui berbagai kegiatan akademik dan keilmuan.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/news/psi-cabang-surabaya-perkuat-kolaborasi-akademik-dan-keilmuan",
    category: "ORGANISASI",
  },
  {
    id: "news-2",
    title:
      "Seminar Nasional Fisika dan Pendidikan Hadirkan Ruang Diskusi Keilmuan",
    date: "20 Agustus 2026",
    excerpt:
      "Seminar nasional menjadi ruang bertemunya akademisi, pendidik, peneliti, dan mahasiswa untuk membahas perkembangan fisika dan pendidikan.",
    image: "/assets/activity/penyelarasan-kurikulum.jpeg",
    href: "/news/seminar-nasional-fisika-dan-pendidikan",
    category: "SEMINAR",
  },
  {
    id: "news-3",
    title: "PSI Cabang Surabaya Gelar Pertemuan Rutin Anggota",
    date: "15 Agustus 2026",
    excerpt:
      "Pertemuan rutin menjadi ruang koordinasi dan pertukaran informasi bagi anggota PSI Cabang Surabaya.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/news/psi-cabang-surabaya-gelar-pertemuan-rutin-anggota",
    category: "PERTEMUAN_RUTIN",
  },
  {
    id: "news-4",
    title: "Workshop Pengembangan Kompetensi dan Keilmuan Fisika",
    date: "8 Agustus 2026",
    excerpt:
      "Kegiatan workshop menghadirkan ruang pembelajaran dan pengembangan kompetensi bagi anggota dan komunitas fisika.",
    image: "/assets/activity/penyelarasan-kurikulum.jpeg",
    href: "/news/workshop-pengembangan-kompetensi-dan-keilmuan-fisika",
    category: "WORKSHOP",
  },
  {
    id: "news-5",
    title: "PSI Cabang Surabaya Bangun Kerjasama dengan Institusi Pendidikan",
    date: "1 Agustus 2026",
    excerpt:
      "Kerjasama menjadi bagian dari upaya memperluas jejaring dan membuka peluang kolaborasi dalam bidang fisika dan pendidikan.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/news/psi-cabang-surabaya-bangun-kerjasama",
    category: "KERJASAMA",
  },
  {
    id: "news-6",
    title: "Anggota PSI Cabang Surabaya Raih Prestasi di Bidang Keilmuan",
    date: "25 Juli 2026",
    excerpt:
      "Prestasi anggota menjadi bagian dari kontribusi dan perkembangan komunitas fisika di tingkat regional maupun nasional.",
    image: "/assets/activity/penyelarasan-kurikulum.jpeg",
    href: "/news/anggota-psi-cabang-surabaya-raih-prestasi",
    category: "PRESTASI_ANGGOTA",
  },
];

interface BeritaPageProps {
  searchParams: Promise<{
    kategori?: string;
  }>;
}

export default async function BeritaPage({
  searchParams,
}: BeritaPageProps) {
  const { kategori } = await searchParams;

  /*
   * TODO:
   * Aktifkan kembali getNews() setelah UI News selesai.
   *
   * const news = await getNews({
   *   limit: 10,
   *   category: kategori,
   * });
   */

  const filteredNews = kategori
    ? dummyNews.filter((item) => item.category === kategori)
    : dummyNews;

  const isFiltered = Boolean(kategori);

  const featuredNews = isFiltered ? undefined : filteredNews[0];
  const archiveNews = isFiltered ? filteredNews : filteredNews.slice(1);

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