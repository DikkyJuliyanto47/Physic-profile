import { Container, Section, PageBreadcrumb } from "@/components/ui";
import {
  ConnectSection,
  CollaborationCta,
  LocationSection,
} from "@/components/features/contact";

export default function KontakPage() {
  return (
    <>
      <Section padding="compact" className="pb-12 sm:pb-16 lg:pb-20">
        <Container>
          <PageBreadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Kontak" },
            ]}
          />

          <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-12 lg:mt-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 sm:text-sm">
              Kontak
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08]">
              Terhubung dengan PSI Surabaya
            </h1>

            <div className="mx-auto mt-5 h-px w-12 bg-primary-400" />

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
              Hubungi PSI Cabang Surabaya untuk informasi, kegiatan, dan
              kolaborasi.
            </p>
          </div>
        </Container>
      </Section>

      <ConnectSection />
      <CollaborationCta />
      <LocationSection />
    </>
  );
}