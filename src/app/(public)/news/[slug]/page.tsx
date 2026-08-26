import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { prisma } from "@/lib/prisma";
import { Container, Section } from "@/components/ui";

const CATEGORY_LABELS: Record<string, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

interface DummyNews {
  id: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
}

// TODO: Hapus dummyNews ini setelah integrasi Prisma selesai
const dummyNews: DummyNews[] = [
  {
    id: "news-1",
    slug: "psi-cabang-surabaya-perkuat-kolaborasi-akademik",
    title: "PSI Cabang Surabaya Perkuat Kolaborasi Akademik dan Keilmuan",
    category: "ORGANISASI",
    excerpt:
      "PSI Cabang Surabaya terus memperkuat komunikasi dan kolaborasi antaranggota melalui berbagai kegiatan akademik dan keilmuan.",
    content: `
      <p>
        PSI Cabang Surabaya terus mengembangkan ruang kolaborasi yang mempertemukan
        akademisi, peneliti, pendidik, mahasiswa, dan anggota komunitas fisika.
        Kegiatan ini menjadi bagian dari upaya memperkuat komunikasi serta
        pertukaran gagasan di lingkungan keilmuan fisika.
      </p>

      <p>
        Melalui pertemuan dan diskusi yang dilakukan secara berkala, anggota
        dapat berbagi informasi mengenai perkembangan kegiatan akademik,
        penelitian, pendidikan, serta berbagai aktivitas organisasi.
      </p>

      <h2>Memperkuat Komunikasi Antaranggota</h2>

      <p>
        Kolaborasi menjadi salah satu bagian penting dalam pengembangan organisasi.
        Ruang diskusi yang terbuka memungkinkan anggota untuk menyampaikan gagasan,
        membangun jejaring, dan mengembangkan kegiatan bersama.
      </p>

      <p>
        PSI Cabang Surabaya akan terus mendorong kegiatan yang memberikan manfaat
        bagi anggota sekaligus memperkuat kontribusi organisasi terhadap
        perkembangan fisika dan pendidikan di Indonesia.
      </p>
    `,
    imageUrl: "/assets/activity/pertemuan-07-27-01.jpeg",
    publishedAt: "26 Agustus 2026",
    author: "PSI Cabang Surabaya",
  },
  {
    id: "news-2",
    slug: "seminar-nasional-fisika-dan-pendidikan",
    title: "Seminar Nasional Fisika dan Pendidikan Hadirkan Ruang Diskusi Keilmuan",
    category: "SEMINAR",
    excerpt:
      "Seminar nasional menjadi ruang bertemunya akademisi, pendidik, peneliti, dan mahasiswa untuk membahas perkembangan fisika dan pendidikan.",
    content: `
      <p>
        Perkembangan ilmu fisika dan pendidikan membutuhkan ruang dialog yang
        mempertemukan berbagai perspektif. Seminar nasional ini menjadi salah
        satu ruang untuk membahas berbagai isu dan perkembangan terbaru.
      </p>

      <h2>Forum Pertukaran Gagasan</h2>

      <p>
        Kegiatan menghadirkan berbagai pembicara dan peserta dari latar belakang
        akademik yang beragam. Diskusi diarahkan pada pengembangan keilmuan,
        pendidikan, serta peluang kolaborasi di masa mendatang.
      </p>
    `,
    imageUrl: "/assets/activity/penyelarasan-kurikulum.jpeg",
    publishedAt: "20 Agustus 2026",
    author: "PSI Cabang Surabaya",
  },
];

// TODO: Hapus fungsi ini setelah integrasi Prisma selesai
function getDummyNews(slug: string) {
  return dummyNews.find((item) => item.slug === slug);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // TODO: Ganti dengan query Prisma, ini hanya untuk sementara
  const news = getDummyNews(slug);

  // const news = await prisma.news.findUnique({
  //   where: {
  //     slug,
  //     status: "PUBLISHED",
  //   },
  //   select: {
  //     title: true,
  //     excerpt: true,
  //     imageUrl: true,
  //     category: true,
  //     publishedAt: true,
  //   },
  // });

  if (!news) {
    return {
      title: "Berita Tidak Ditemukan",
    };
  }

  const categoryLabel =
    CATEGORY_LABELS[news.category] ?? news.category;

  const description =
    news.excerpt ??
    `Berita ${categoryLabel} dari PSI Cabang Surabaya`;

  return {
    title: news.title,
    description,
    openGraph: {
      title: news.title,
      description,
      type: "article",
      locale: "id_ID",
      siteName: "PSI Cabang Surabaya",
      ...(news.imageUrl && {
        images: [
          {
            url: news.imageUrl,
            width: 1200,
            height: 630,
            alt: news.title,
          },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      ...(news.imageUrl && {
        images: [news.imageUrl],
      }),
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // TODO: Ganti dengan query Prisma, ini hanya untuk sementara
  const news = getDummyNews(slug);

  // const news = await prisma.news.findUnique({
  //   where: {
  //     slug,
  //     status: "PUBLISHED",
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     category: true,
  //     excerpt: true,
  //     content: true,
  //     imageUrl: true,
  //     publishedAt: true,
  //     createdAt: true,
  //     author: {
  //       select: {
  //         name: true,
  //       },
  //     },
  //   },
  // });

  if (!news) {
    notFound();
  }

  const categoryLabel =
    CATEGORY_LABELS[news.category] ?? news.category;

  return (
    <main>
      <Section padding="normal">
        <Container>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-primary-600"
          >
            <span aria-hidden="true">←</span>
            Kembali ke Berita
          </Link>

          <header className="mt-8 max-w-4xl">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                {categoryLabel}
              </span>

              <span className="text-xs text-foreground-muted">
                {news.publishedAt}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-primary-950 sm:text-4xl lg:text-5xl">
              {news.title}
            </h1>

            <p className="mt-4 text-sm text-foreground-muted">
              Ditulis oleh{" "}
              <span className="font-medium text-primary-900">
                {news.author}
              </span>
            </p>
          </header>
        </Container>
      </Section>

      <Section padding="normal" className="pt-0">
        <Container>
          <article className="mx-auto max-w-4xl">
            {news.imageUrl && (
              <div className="relative aspect-video overflow-hidden rounded-md bg-background-muted">
                <Image
                  src={news.imageUrl}
                  alt={news.title}
                  fill
                  unoptimized
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 900px"
                />
              </div>
            )}

            {news.excerpt && (
              <p className="mt-8 max-w-3xl text-lg font-medium leading-8 text-primary-900 sm:text-xl">
                {news.excerpt}
              </p>
            )}

            <div
              className="prose prose-lg mt-8 max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-primary-950 prose-p:text-foreground-muted prose-a:text-primary-600 prose-img:rounded-md"
              dangerouslySetInnerHTML={{
                __html: news.content,
              }}
            />

            <div className="mt-14">
              <Link
                href="/news"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary-900 transition-colors hover:text-primary-600"
              >
                <span aria-hidden="true">←</span>
                Kembali ke Semua Berita
              </Link>
            </div>
          </article>
        </Container>
      </Section>
    </main>
  );
}