/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 08:06:54
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:06:54
 */

import Link from "next/link";
import { Card, Container, Section, SectionHeading } from "@/components/ui";
import { latestNews } from "./data";

export function LatestNewsPanel() {
  return (
    <Section tone="muted" className="-mt-10 lg:-mt-14">
      <Container className="flex flex-col gap-8">
        <div className="border-t border-border pt-8">
          <SectionHeading
            eyebrow="Berita"
            title="Berita Terbaru"
            action={
              <Link
                href="/berita"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                Lihat Semua Berita →
              </Link>
            }
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latestNews.map((item) => (
            <Card
              key={item.id}
              padded={false}
              className="flex h-full flex-col overflow-hidden transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40 w-full bg-neutral-200" />

              <div className="flex flex-1 flex-col gap-3 p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">
                  {item.date}
                </span>

                <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                  {item.title}
                </h3>

                <p className="line-clamp-3 text-sm text-foreground-muted">
                  {item.excerpt}
                </p>

                {item.href && (
                  <Link
                    href={item.href}
                    className="mt-auto pt-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
                  >
                    Baca Berita →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
