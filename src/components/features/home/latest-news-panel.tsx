/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 08:06:54 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-02 08:06:54 
 */

import Link from "next/link";
import { Card, SectionHeading } from "@/components/ui";
import { latestNews } from "./data";

export function LatestNewsPanel() {
  return (
    <aside className="flex h-full flex-col">
      <SectionHeading
        eyebrow="Berita"
        title="Berita Terbaru"
      />

      <div
        className="
          mt-4
          h-107.5
          overflow-y-auto
          overscroll-contain
          scroll-smooth
          space-y-3
          pr-2
        "
      >
        {latestNews.map((item) => (
          <Card
            key={item.id}
            padded={false}
            className="overflow-hidden"
          >
            <div className="h-28 w-full bg-neutral-200" />

            <div className="space-y-1 p-3">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-600">
                {item.date}
              </span>

              <p className="line-clamp-2 text-sm text-foreground-muted">
                {item.excerpt}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Link
        href="/berita"
        className="mt-4 text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        Lihat Semua Berita
      </Link>
    </aside>
  );
}