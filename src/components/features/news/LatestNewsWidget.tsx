/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 13:00:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 13:00:00
 */

import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { SidebarSection } from "./SidebarSection";
import type { NewsItem } from "./data";

interface LatestNewsWidgetProps {
  items: NewsItem[];
  limit?: number;
}

export function LatestNewsWidget({ items, limit = 2 }: LatestNewsWidgetProps) {
  const visibleItems = items.slice(0, limit);

  if (visibleItems.length === 0) return null;

  return (
    <SidebarSection title="Berita" action={{ label: "Lihat Selengkapnya", href: "/news" }}>
      <div className="flex flex-col gap-5">
        {visibleItems.map((item) => (
          <div key={item.id} className="flex flex-col gap-2">
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-lg border border-border bg-neutral-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 25vw, 100vw"
                className="object-cover"
              />
            </div>

            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-600">
              <FaCalendarAlt className="h-3 w-3" aria-hidden="true" />
              {item.date}
            </span>

            <p className="line-clamp-2 text-sm text-foreground-muted">{item.excerpt}</p>

            <Link
              href={item.href}
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Baca Selengkapnya →
            </Link>
          </div>
        ))}
      </div>
    </SidebarSection>
  );
}
