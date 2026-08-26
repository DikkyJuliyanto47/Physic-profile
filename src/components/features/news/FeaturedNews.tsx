import Image from "next/image";
import Link from "next/link";

import type { NewsItem } from "./data";

const CATEGORY_LABELS: Record<string, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

interface FeaturedNewsProps {
  item: NewsItem;
}

export function FeaturedNews({ item }: FeaturedNewsProps) {
  const categoryLabel = CATEGORY_LABELS[item.category] ?? item.category;

  return (
    <article className="border-y border-border py-6 sm:py-8">
      <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-[0.12em] text-primary-700">
        <span>Berita Terbaru</span>
        <span className="h-px w-8 bg-primary-200" aria-hidden="true" />
        <span>{categoryLabel}</span>
        <span className="text-foreground-muted">/</span>
        <time className="text-foreground-muted">{item.date}</time>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:items-center lg:gap-10">
        <Link
          href={item.href}
          className="group relative block aspect-16/10 overflow-hidden rounded-md bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        </Link>

        <div className="min-w-0">
          <h2 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-primary-950 sm:text-3xl lg:text-4xl">
            <Link
              href={item.href}
              className="transition-colors hover:text-primary-700"
            >
              {item.title}
            </Link>
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-foreground-muted">
            {item.excerpt}
          </p>

          <Link
            href={item.href}
            className="mt-6 inline-flex items-center border-b border-primary-300 pb-1 text-sm font-semibold text-primary-800 transition-colors hover:border-primary-700 hover:text-primary-700"
          >
            Baca selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
}