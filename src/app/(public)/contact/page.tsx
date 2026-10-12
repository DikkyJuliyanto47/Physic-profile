import { Container, Section, PageBreadcrumb } from "@/components/ui";
import { ConnectSection } from "@/components/features/contact";

export default function KontakPage() {
  return (
    <>
      <Section padding="none" className="pb-7 pt-8 sm:pb-8 sm:pt-10">
        <Container>
          <PageBreadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Kontak" },
            ]}
          />
          <header className="mt-6 max-w-3xl">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-4xl">
              Hubungi Kami
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7">
              Untuk informasi organisasi, keanggotaan, kegiatan ilmiah, dan
              peluang kolaborasi dengan PSI Cabang Surabaya.
            </p>
          </header>
        </Container>
      </Section>
      <ConnectSection />
    </>
  );
}
