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
    <div className="flex flex-col gap-5">
      <SectionHeading eyebrow="Berita" title="Berita Terbaru" />
      <div className="flex flex-col gap-4">
        {latestNews.map((item) => (
          <Card key={item.id} padded={false} className="overflow-hidden">
            <div className="aspect-video w-full bg-neutral-200" />
            <div className="flex flex-col gap-2 p-4">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                {item.date}
              </span>
              <p className="text-sm text-foreground-muted">{item.excerpt}</p>
            </div>
          </Card>
        ))}
      </div>
      <Link
        href="/berita"
        className="text-sm font-semibold text-primary-600 hover:text-primary-700"
      >
        Lihat Semua Berita
      </Link>
    </div>
  );
}
