import Image from "next/image";

import { Button, Container, Section } from "@/components/ui";

import { galleryItems } from "./data";

export function AboutSection() {
  const image = galleryItems[0]?.image;

  return (
    <Section className="relative overflow-visible py-16 sm:py-20 lg:py-24">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

          <div className="relative mx-auto w-full max-w-xl">
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                -left-20 -top-24
                h-72 w-72
                rounded-full
                bg-primary-500/70
                sm:-left-28 sm:-top-32
                sm:h-80 sm:w-80
                lg:-left-32 lg:-top-36
                lg:h-96 lg:w-96
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute
                left-[47%]
                -bottom-36
                h-80 w-80
                -translate-x-1/2
                rounded-full
                bg-primary-500/50

                sm:left-[84%]
                sm:-bottom-40
                sm:h-88 sm:w-88

                lg:left-[84%]
                lg:-bottom-44
                lg:h-112 lg:w-md
              "
            />

            <div
              className="
                group relative z-10
                -rotate-2
                rounded-2xl bg-white
                p-2.5
                shadow-[0_16px_36px_rgba(15,23,42,0.14)]
                transition-transform duration-500
                hover:rotate-0 hover:-translate-y-1
                sm:p-3
              "
            >
              <div
                className="
                  relative aspect-4/3 w-full
                  overflow-hidden rounded-xl
                  bg-background-muted
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
                      duration-700
                      group-hover:scale-[1.025]
                    "
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-foreground-muted">
                    Foto kegiatan PSI
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 max-w-2xl">
            <span
              className="
                font-serif
                text-base
                italic
                font-medium
                tracking-wide
                text-primary-600
                sm:text-lg
              "
            >
              Tentang Kami
            </span>

            <h2
              className="
                mt-2
                max-w-xl
                text-3xl
                font-bold
                leading-[1.12]
                tracking-tight
                text-foreground
                sm:text-4xl
                lg:text-[2.5rem]
              "
            >
              Sekilas tentang PSI Cabang Surabaya
            </h2>

            <div
              className="
                mt-5
                max-w-xl
                space-y-4
                text-base
                leading-7
                text-foreground-muted
                sm:text-lg
                sm:leading-8
              "
            >
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

            <div className="relative mt-7 inline-block">
              {/* blur glow di belakang tombol */}
              <div
                aria-hidden="true"
                className="
                  pointer-events-none absolute
                  inset-0
                  scale-125
                  rounded-full
                  bg-primary-500/50
                  blur-xl
                "
              />
              <Button
                href="/about"
                size="medium"
                className="relative bg-primary-600 text-white hover:bg-primary-700"
              >
                Selengkapnya →
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}