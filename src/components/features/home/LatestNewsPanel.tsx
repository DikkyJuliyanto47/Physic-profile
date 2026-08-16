/*
 * @Author: galhkoernia
 * @Date: 2026-08-02 08:06:54
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 12:00:00
 */

import Image from "next/image";
import Link from "next/link";
import {
  Button,
  Card,
  Container,
  Section,
  SectionHeading,
} from "@/components/ui";
import { getLatestNews } from "@/components/features/news";

export async function LatestNewsPanel() {
  const latestNews = await getLatestNews(3);

  return (
    <Section padding="compact">
      <Container className="flex flex-col items-center gap-8">
        <div className="text-center">
          <SectionHeading
            eyebrow="Informasi Terbaru"
            title="Informasi Terbaru PSI Cabang Surabaya"
            align="center"
          />

          <div className="mx-auto mt-3 h-0.5 w-16 bg-primary-600" />
        </div>

        <div
          className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-1 scrollbar-none [-ms-overflow-style:none] sm:flex-wrap sm:justify-center sm:snap-none sm:overflow-visible [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {latestNews.map((item) => (
            <Card
              key={item.id}
              padded={false}
              className="
                group
                flex min-h-120 w-full min-w-0 basis-full shrink-0 snap-center flex-col
                overflow-hidden
                rounded-md
                border-border/70
                shadow-sm
                transition-transform duration-200
                hover:-translate-y-1
                active:scale-[0.99]
                sm:basis-75
                sm:max-w-75
                sm:flex-none
                sm:justify-center
              "
            >
              <div className="relative h-52 w-full shrink-0 overflow-hidden">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 30vw, 100vw"
                  className="
                    object-cover
                    transition-transform duration-300
                    group-hover:scale-[1.02]
                  "
                />
              </div>

              <div className="flex flex-1 flex-col p-5">
                <span className="text-xs font-medium text-primary-600">
                  {item.date}
                </span>

                <h3 className="mt-2 text-sm font-semibold leading-6 text-foreground">
                  {item.title}
                </h3>

                <p className="mt-3 line-clamp-6 text-xs leading-5 text-foreground-muted">
                  {item.excerpt}
                </p>

                {item.href && (
                  <Link
                    href={item.href}
                    className="
                      mt-auto pt-5
                      text-xs font-semibold text-primary-600
                      transition-colors duration-200
                      hover:text-primary-700
                    "
                  >
                    Baca Selengkapnya →
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        <Button href="/news" size="medium">
          Lihat Informasi Lainnya →
        </Button>
      </Container>
    </Section>
  );
}
