import Image from "next/image";
import Link from "next/link";

import {
  Button,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";

import { getLatestNews } from "@/components/features/news";

export async function LatestNewsPanel() {
  // TODO: Aktifkan kembali setelah sumber berita/API sudah tersambung.
  // const latestNews = await getLatestNews(3);

  // TEMPORARY MOCK DATA
  // Hanya digunakan untuk preview visual landing page.
  // Hapus blok ini dan aktifkan getLatestNews() di atas ketika data sudah tersedia.
  const latestNews = [
    {
      id: "mock-news-1",
      title: "Koordinasi Pengurus PSI Cabang Surabaya",
      date: "27 Juli 2026",
      excerpt:
        "Pertemuan pengurus PSI Cabang Surabaya untuk memperkuat koordinasi organisasi dan agenda kegiatan.",
      image: "/assets/gallery/pertemuan-07-27-01.jpeg",
      href: "/news/mock-news-1",
    },
    {
      id: "mock-news-2",
      title: "Kolaborasi Akademik dan Pengembangan Komunitas Fisika",
      date: "20 Juli 2026",
      excerpt:
        "Kolaborasi antara akademisi, peneliti, pendidik, dan mahasiswa dalam kegiatan keilmuan PSI.",
      image: "/assets/gallery/pertemuan-07-27-02.jpeg",
      href: "/news/mock-news-2",
    },
    {
      id: "mock-news-3",
      title: "Pertemuan Rutin Anggota PSI Cabang Surabaya",
      date: "12 Juli 2026",
      excerpt:
        "Pertemuan rutin anggota untuk menjaga komunikasi dan diskusi perkembangan fisika.",
      image: "/assets/gallery/pertemuan-07-27-03.jpeg",
      href: "/news/mock-news-3",
    },
  ];

  return (
    <Section padding="compact">
      <Container className="flex flex-col items-center gap-8">
        <div className="text-center">
           <SectionHeading
            eyebrow="Informasi Terbaru"
            title="Informasi Terbaru PSI Cabang Surabaya"
            align="center"
          />
        </div>

        <div className="grid w-full max-w-5xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((item) => (
            <article
              key={item.id}
              className="
                group relative flex flex-col overflow-hidden
                rounded-[1rem]
                border border-border/70
                bg-white
                text-center
                shadow-[0_6px_24px_rgba(15,23,42,0.055)]
                transition-[transform,box-shadow,border-color]
                duration-300 ease-out
                hover:-translate-y-1
                hover:border-primary-100
                hover:shadow-[0_16px_36px_rgba(15,23,42,0.09)]
              "
            >
              <Link href={item.href} className="block overflow-hidden">
                <div className="relative aspect-16/10 overflow-hidden bg-background-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="
                      (min-width: 1024px) 30vw,
                      (min-width: 640px) 45vw,
                      100vw
                    "
                    className="
                      object-cover
                      transition-transform duration-500
                      group-hover:scale-[1.025]
                    "
                  />
                </div>
              </Link>

              <div className="flex flex-1 flex-col items-center px-5 pb-6 pt-5">
                <time className="text-xs font-semibold uppercase tracking-widest text-primary-600">
                  {item.date}
                </time>

                <h3 className="mt-3 line-clamp-2 text-lg font-bold leading-6 tracking-tight text-foreground">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-3 max-w-xs text-sm leading-6 text-foreground-muted">
                  {item.excerpt}
                </p>

                <Link
                  href={item.href}
                  className="
                    mt-5 inline-flex items-center gap-1.5
                    border-b border-transparent
                    pb-0.5
                    text-sm font-semibold
                    text-primary-600
                    transition-[color,border-color,gap]
                    duration-200
                    hover:gap-2.5
                    hover:border-primary-600
                  "
                >
                  Baca selengkapnya
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <Button href="/news" variant="outline" size="medium">
          Lihat Informasi Lainnya →
        </Button>
      </Container>
    </Section>
  );
}