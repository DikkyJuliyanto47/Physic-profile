import Image from "next/image";

import { Button, Container, Section } from "@/components/ui";
import { aboutItems } from "./data";

export function AboutSection() {
  const item = aboutItems[0];
  const imageUrl = item?.image;

  return (
    <Section
      tone="dark"
      padding="none"
      className="relative overflow-hidden text-white"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_92%_85%,rgba(255,255,255,0.2),transparent_34%),linear-gradient(115deg,#0c2d50_0%,#123d67_52%,#52718f_78%,#eef3f7_125%)]" />

      <div className="relative grid lg:grid-cols-2">
        <div className="relative order-2 min-h-72 overflow-hidden lg:order-1 lg:min-h-full">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Kegiatan Physical Society of Indonesia Cabang Surabaya"
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out hover:scale-[1.02]"
            />
          ) : (
            <div className="flex h-full min-h-72 items-center justify-center bg-primary-800 text-sm text-white/60">
              Foto kegiatan PSI
            </div>
          )}

          <div className="absolute inset-0 bg-linear-to-t from-primary-950/35 via-transparent to-primary-950/5" />

          <div className="pointer-events-none absolute inset-5 border border-white/20 sm:inset-7" />
        </div>

        <div className="relative order-1 flex items-center lg:order-2">
          <div className="pointer-events-none absolute bottom-0 right-0 h-44 w-1/2 bg-linear-to-l from-white/10 to-transparent" />

          <Container className="relative w-full py-11 sm:py-13 lg:py-14 xl:pl-14 2xl:pl-20">
            <div className="max-w-xl">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300 sm:text-sm">
                Tentang Kami
              </span>

              <h2 className="mt-3 max-w-xl text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[2.6rem]">
                Sekilas Tentang Physical Society of Indonesia Cabang Surabaya
              </h2>

              <div className="mt-5 h-px w-14 bg-primary-300" />

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
                href={item?.href || "/about"}
                size="medium"
                className="mt-6 bg-primary-600 text-white transition-colors hover:bg-primary-500"
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