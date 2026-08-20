import { Button, Container, Section } from "@/components/ui";

export function AboutSection() {
  return (
    <Section padding="compact" className="py-16 lg:py-20">
      <Container>
        <div className="max-w-5xl">
          <div className="flex w-full flex-col gap-3">
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-600 sm:text-xl">
              Tentang Kami
            </span>

            <h2 className="max-w-155 text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Sekilas tentang PSI Cabang Surabaya
            </h2>
          </div>

          <div className="mt-6 max-w-4xl space-y-6 text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
            <p>
              Physical Society of Indonesia (PSI) adalah organisasi profesi dan komunitas ilmiah bidang fisika di Indonesia.
              PSI menjadi wadah bagi para fisikawan, akademisi, peneliti, pendidik, mahasiswa, dan pihak lain yang berkaitan
              dengan ilmu fisika untuk berkomunikasi, berkolaborasi, mengembangkan ilmu pengetahuan, serta berkontribusi pada pendidikan dan masyarakat.
              PSI sebelumnya dikenal sebagai Himpunan Fisika Indonesia (HFI) dan kemudian menggunakan nama Physical Society of Indonesia.
            </p>

            <p>
              PSI Cabang Surabaya adalah bagian dari organisasi PSI yang menjalankan aktivitas tersebut pada tingkat cabang di wilayah Surabaya dan sekitarnya.
            </p>
          </div>

          <div className="mt-8">
            <Button
              href="/about"
              variant="outline"
              size="large"
              className="border border-gray-400"
            >
              Selengkapnya →
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}