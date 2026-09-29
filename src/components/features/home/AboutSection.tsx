import Image from "next/image";

import { Button, Container, Section } from "@/components/ui";
import { aboutItems } from "./data";

export function AboutSection() {
  const item = aboutItems[0];
  const imageUrl = item?.image;

  return (
    <Section
      padding="none"
      className="bg-white pt-10 text-primary-950 sm:pt-12 lg:pt-16"
    >
      <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
        
        <div className="relative min-h-80 overflow-hidden bg-neutral-100 sm:min-h-100 lg:min-h-125">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Kegiatan Physical Society of Indonesia Cabang Surabaya"
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover object-center"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
              Foto kegiatan PSI
            </div>
          )}
        </div>

        <div className="flex items-center">
          <Container className="w-full py-10 sm:py-12 lg:py-14 lg:pl-10 xl:pl-14 2xl:pl-16">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 sm:text-sm">
                Tentang Kami
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-[1.15] tracking-tight text-primary-950 sm:text-4xl lg:text-[2.5rem]">
                Sekilas Tentang Physical Society of Indonesia Cabang Surabaya
              </h2>

              <div className="mt-5 space-y-4 text-sm leading-7 text-foreground-muted sm:text-base">
                <p>
                  Physical Society of Indonesia (PSI) adalah organisasi profesi
                  dan komunitas ilmiah bidang fisika di Indonesia. PSI menjadi
                  wadah bagi para fisikawan, akademisi, peneliti, pendidik,
                  mahasiswa, dan pihak lain yang berkaitan dengan ilmu fisika
                  untuk berkomunikasi, berkolaborasi, mengembangkan ilmu
                  pengetahuan, serta berkontribusi pada pendidikan dan masyarakat.
                </p>

                <p>
                  PSI sebelumnya dikenal sebagai Himpunan Fisika Indonesia (HFI)
                  dan kemudian menggunakan nama Physical Society of Indonesia.
                  PSI Cabang Surabaya merupakan bagian dari organisasi PSI yang
                  menjalankan aktivitas tersebut pada tingkat cabang di wilayah
                  Surabaya dan sekitarnya.
                </p>
              </div>

              <Button
                href={item?.href || "/about"}
                variant="primary"
                size="medium"
                className="mt-6 px-5"
              >
                Lihat Selengkapnya →
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}