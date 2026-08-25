import Image from "next/image";
import Link from "next/link";

import { Button, Container, Section, SectionHeading } from "@/components/ui";
import { getLatestNews } from "@/components/features/news";

export async function LatestNewsPanel() {
  // TODO: Aktifkan kembali setelah sumber berita/API sudah tersambung.
  // const latestNews = await getLatestNews(3);

  // TEMPORARY MOCK DATA — hanya digunakan untuk preview visual landing page.
  // Hapus blok ini dan aktifkan getLatestNews() ketika data sudah tersedia.
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
    <Section className="relative overflow-hidden py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-28 -bottom-28 h-64 w-64 rounded-full bg-primary-500/45 sm:-left-36 sm:-bottom-32 sm:h-80 sm:w-80"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-28 top-[42%] h-56 w-56 rounded-full bg-primary-500/35 sm:-right-36 sm:h-72 sm:w-72"
      />

      <Container className="relative z-10 flex flex-col items-center">
        <div className="text-center">
          <SectionHeading
            eyebrow="Informasi Terbaru"
            title="Informasi Terbaru PSI Cabang Surabaya"
            align="center"
          />
        </div>

        <div className="mt-8 grid w-full max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {latestNews.map((item) => (
            <article key={item.id} className="group relative flex min-w-0 flex-col">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-2 rounded-[0.7rem] bg-black/5.5 blur-xl transition-colors duration-300 group-hover:bg-black/9"
              />

              <div
                className="
                  relative flex flex-1 flex-col overflow-hidden
                  rounded-[0.55rem] border border-border/70 bg-white
                  shadow-[0_4px_12px_rgba(15,23,42,0.045)]
                  transition-[transform,box-shadow,border-color] duration-300 ease-out
                  group-hover:-translate-y-1 group-hover:border-border
                  group-hover:shadow-[0_14px_30px_rgba(15,23,42,0.09)]
                "
              >
                <Link
                  href={item.href}
                  className="block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-400"
                >
                  <div className="relative aspect-video overflow-hidden bg-background-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025]"
                    />
                  </div>
                </Link>

                <div className="flex flex-1 flex-col px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
                  <time className="text-[11px] font-medium uppercase tracking-[0.12em] text-primary-600 sm:text-xs">
                    {item.date}
                  </time>

                  <h3 className="mt-2.5 line-clamp-2 text-base font-bold leading-6 tracking-tight text-foreground sm:text-lg">
                    {item.title}
                  </h3>

                  <p className="mt-2.5 line-clamp-3 text-sm leading-6 text-foreground-muted">
                    {item.excerpt}
                  </p>

                  <Link
                    href={item.href}
                    className="
                      mt-4 inline-flex w-fit items-center gap-1.5
                      border-b border-transparent pb-0.5
                      text-xs font-semibold text-primary-600
                      transition-[color,border-color,gap] duration-200
                      hover:gap-2.5 hover:border-primary-600 hover:text-primary-700
                      focus-visible:outline-none focus-visible:ring-2
                      focus-visible:ring-primary-300 focus-visible:ring-offset-2
                    "
                  >
                    Baca selengkapnya <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <Button href="/news" variant="outline" size="medium" className="mt-8">
          Lihat Informasi Lainnya →
        </Button>
      </Container>
    </Section>
  );
}