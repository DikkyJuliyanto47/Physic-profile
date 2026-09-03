import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getNewsBySlug } from "@/lib/data";
import { Container, Section } from "@/components/ui";

const CATEGORY_LABELS: Record<string, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

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
  const news = await getNewsBySlug(slug);

  if (!news) {
    return { title: "Berita Tidak Ditemukan" };
  }

  const categoryLabel = CATEGORY_LABELS[news.category] ?? news.category;
  const description =
    news.excerpt ?? `Berita ${categoryLabel} dari PSI Cabang Surabaya`;

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
          { url: news.imageUrl, width: 1200, height: 630, alt: news.title },
        ],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: news.title,
      description,
      ...(news.imageUrl && { images: [news.imageUrl] }),
    },
  };
}

export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const news = await getNewsBySlug(slug);

  if (!news) notFound();

  const categoryLabel = CATEGORY_LABELS[news.category] ?? news.category;

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
                {formatDate(news.publishedAt ?? news.createdAt)}
              </span>
            </div>

            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-primary-950 sm:text-4xl lg:text-5xl">
              {news.title}
            </h1>

            <p className="mt-4 text-sm text-foreground-muted">
              Ditulis oleh{" "}
              <span className="font-medium text-primary-900">
                {news.author.name}
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
