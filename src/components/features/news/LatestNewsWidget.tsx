import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { SidebarSection } from "./SidebarSection";
import type { NewsItem } from "./data";

interface LatestNewsWidgetProps {
  items: NewsItem[];
  limit?: number;
}

export function LatestNewsWidget({
  items,
  limit = 2,
}: LatestNewsWidgetProps) {
  const visibleItems = items.slice(0, limit);

  if (visibleItems.length === 0) return null;

  return (
    <SidebarSection
      title="Berita"
      action={{ label: "Lihat Selengkapnya", href: "/news" }}
    >
      <div className="divide-y divide-border border-y border-border">
        {visibleItems.map((item) => (
          <article key={item.id} className="py-5 first:pt-0 last:pb-0">
            <Link
              href={item.href}
              className="group relative block aspect-16/10 overflow-hidden bg-neutral-100"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 320px, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </Link>

            <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-primary-700">
              <FaCalendarAlt className="h-3 w-3" aria-hidden="true" />
              <time>{item.date}</time>
            </div>

            <h3 className="mt-2 text-sm font-semibold leading-5 text-primary-950">
              <Link
                href={item.href}
                className="transition-colors hover:text-primary-700"
              >
                {item.title}
              </Link>
            </h3>

            {item.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-foreground-muted">
                {item.excerpt}
              </p>
            )}

            <Link
              href={item.href}
              className="mt-3 inline-flex border-b border-primary-200 pb-1 text-xs font-semibold text-primary-700 transition-colors hover:border-primary-700"
            >
              Baca selengkapnya →
            </Link>
          </article>
        ))}
      </div>
    </SidebarSection>
  );
}