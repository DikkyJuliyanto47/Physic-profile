import Image from "next/image";

import { Button, Container, Section } from "@/components/ui";
import { galleryItems } from "./data";

export function AboutSection() {
  const image = galleryItems[0]?.image;

  return (
    <Section
      tone="dark"
      className="relative overflow-visible bg-primary-900 py-0 text-white"
    >
      <div className="grid min-h-155 lg:grid-cols-2">
        <div className="relative min-h-80 w-full lg:min-h-155">
          {image ? (
            <Image
              src={image}
              alt="Kegiatan Physical Society of Indonesia Cabang Surabaya"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center bg-primary-800 text-sm text-white/60">
              Foto kegiatan PSI
            </div>
          )}
        </div>

        <div className="flex items-center">
          <Container className="w-full py-14 sm:py-16 lg:py-20 xl:pl-14 2xl:pl-20">
            <div className="max-w-2xl">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300 sm:text-sm">
                Tentang Kami
              </span>

              <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Sekilas tentang PSI Cabang Surabaya
              </h2>

              <div className="mt-5 h-px w-16 bg-primary-400" />

              <div className="mt-5 space-y-4 text-sm leading-7 text-white/75 sm:text-base sm:leading-7">
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
                href="/about"
                size="medium"
                className="mt-7 bg-primary-600 text-white hover:bg-primary-500"
              >
                Selengkapnya →
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}