import Image from "next/image";

import { Button, Container, Section } from "@/components/ui";
import { galleryItems } from "./data";

export function AboutSection() {
  const image = galleryItems[0]?.image;

  return (
    <Section className="relative overflow-visible py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="relative grid items-center gap-14 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <div className="group relative z-10 mx-auto w-full max-w-xl lg:mx-0">
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                -left-24 -top-32
                h-96 w-[24rem]
                rounded-full
                bg-primary-500/70
                transition-[transform,opacity]
                duration-700 ease-out
                motion-safe:group-hover:scale-[1.025]
                sm:-left-32 sm:-top-40
                sm:h-120 sm:w-120
                lg:-left-40 lg:-top-48
                lg:h-136 lg:w-136
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                -bottom-24 -right-24
                h-52 w-52
                rounded-full
                bg-primary-300/55
                transition-[transform,opacity]
                duration-700 ease-out
                motion-safe:group-hover:scale-[1.04]
                sm:-bottom-32 sm:-right-32
                sm:h-64 sm:w-64
                lg:-bottom-40 lg:-right-40
                lg:h-80 lg:w-80
              "
            />

            <div
              className="
                relative z-10
                aspect-4/3
                w-full overflow-hidden
                rounded-[1rem]
                border border-white/90
                bg-background-muted
                shadow-[0_14px_36px_rgba(15,23,42,0.10)]
                transition-[transform,box-shadow]
                duration-500 ease-out
                group-hover:-translate-y-1
                group-hover:shadow-[0_24px_52px_rgba(15,23,42,0.15)]
              "
            >
              {image ? (
                <Image
                  src={image}
                  alt="Kegiatan Physical Society of Indonesia Cabang Surabaya"
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="
                    object-cover
                    transition-transform
                    duration-700 ease-out
                    motion-safe:group-hover:scale-[1.025]
                  "
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
                  Foto kegiatan PSI
                </div>
              )}

              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute inset-0
                  bg-primary-950/2
                  opacity-0
                  transition-opacity duration-500
                  group-hover:opacity-100
                "
              />
            </div>
          </div>

          <div className="relative z-10 max-w-2xl">
            <span
              className="
                font-serif
                text-lg italic
                font-medium
                tracking-wide
                text-primary-600
                sm:text-xl
              "
            >
              Tentang Kami
            </span>

            <h2
              className="
                mt-3
                max-w-xl
                text-3xl font-bold
                leading-[1.12]
                tracking-tight
                text-foreground
                sm:text-4xl
                lg:text-[2.75rem]
              "
            >
              Sekilas tentang PSI Cabang Surabaya
            </h2>

            <div className="mt-6 max-w-xl space-y-4 text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
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
                PSI Cabang Surabaya adalah bagian dari organisasi PSI yang
                menjalankan aktivitas tersebut pada tingkat cabang di wilayah
                Surabaya dan sekitarnya.
              </p>
            </div>

            <div className="mt-8">
              <Button href="/about" variant="outline" size="medium">
                Selengkapnya →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}