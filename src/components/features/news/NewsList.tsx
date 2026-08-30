import Image from "next/image";
import Link from "next/link";

interface NewsListProps {
  items: NewsItem[];
}

export function NewsList({ items }: NewsListProps) {
  if (items.length === 0) {
    return (
      <div className="border-y border-border py-12 text-center">
        <p className="text-sm text-foreground-muted">
          Belum ada berita yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <article
          key={item.id}
          className="grid gap-5 py-6 sm:grid-cols-[220px_minmax(0,1fr)] sm:gap-7 sm:py-7 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-8"
        >
          <Link
            href={item.href}
            className="group relative block aspect-16/10 overflow-hidden rounded-md bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600"
          >
            <Image
              src={item.image}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 260px, (min-width: 640px) 220px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
          </Link>

          <div className="flex min-w-0 flex-col items-start">
            <span className="inline-flex items-center rounded-md border border-neutral-200 bg-neutral-50 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
              {item.category}
            </span>

            <h2 className="mt-2 max-w-3xl text-lg font-semibold leading-7 tracking-tight text-primary-950 sm:text-xl">
              <Link
                href={item.href}
                className="transition-colors hover:text-primary-700"
              >
                {item.title}
              </Link>
            </h2>

            <p className="mt-2 max-w-2xl line-clamp-2 text-sm leading-6 text-foreground-muted">
              {item.excerpt}
            </p>

            <Link
              href={item.href}
              className="mt-4 inline-flex items-center border-b border-primary-200 pb-1 text-xs font-semibold text-primary-700 transition-colors hover:border-primary-700 hover:text-primary-800 sm:text-sm"
            >
              Baca selengkapnya →
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}