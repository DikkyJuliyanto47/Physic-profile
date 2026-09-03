import Image from "next/image";
import Link from "next/link";

import { getPublishedNews } from "@/lib/data";
import {
Button,
Container,
Section,
SectionHeading,
} from "@/components/ui";

export async function LatestNewsPanel() {
const latestNews = (await getPublishedNews()).slice(0, 3);

return ( <Section
   tone="dark" 
   className="relative overflow-hidden pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24"> 
   <Container> 
      <div className="flex flex-col gap-8"> <SectionHeading
            eyebrow="Informasi Terbaru"
            title="Informasi Terbaru Physical Society of Indonesia (PSI) Cabang Surabaya"
            align="left"
            className="[&_h2]:max-w-2xl [&_p]:text-white/65 [&_span]:text-white/60 [&_h2]:text-white"
      />
          
      {latestNews.length > 0 ? (
        <div className="divide-y divide-white/15 border-y border-white/15">
          {latestNews.map((item) => (
            <article
              key={item.id}
              className="group grid gap-5 py-5 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center sm:gap-7 sm:py-6 lg:grid-cols-[250px_minmax(0,1fr)_auto]"
            >
              <Link
                href={item.href}
                className="relative block aspect-video overflow-hidden bg-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 250px, (min-width: 640px) 220px, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.025]"
                />
              </Link>

              <div className="min-w-0">
                <time className="text-[11px] font-semibold uppercase tracking-[0.12em] text-primary-300 sm:text-xs">
                  {item.date}
                </time>

                <h3 className="mt-2 text-base font-semibold leading-6 tracking-tight text-white sm:text-lg">
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-primary-300"
                  >
                    {item.title}
                  </Link>
                </h3>

                <p className="mt-2 max-w-2xl line-clamp-2 text-sm leading-6 text-white/65">
                  {item.excerpt}
                </p>
              </div>

              <Link
                href={item.href}
                className="inline-flex w-fit items-center border-b border-white/30 pb-1 text-xs font-semibold text-white transition-colors hover:border-primary-300 hover:text-primary-300 sm:text-sm lg:justify-self-end"
              >
                Baca selengkapnya →
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-y border-white/15 py-10 text-sm text-white/60">
          Belum ada informasi yang diterbitkan.
        </div>
      )}

      <Button
        href="/news"
        variant="outline"
        size="medium"
        className="self-start border-white/30 bg-transparent text-white hover:border-white hover:bg-white hover:text-primary-900"
      >
        Lihat Informasi Lainnya →
      </Button>
    </div>
  </Container>
</Section>
);
}
