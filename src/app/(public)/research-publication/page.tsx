import { Container, Hero, Section, SectionNav, ShareActions } from "@/components/ui";

import { ResearchPublicationSection } from "@/components/features/research";

import { JoinCtaSection } from "@/components/features/home";

import { getPublishedPublications } from "@/components/features/research/data";

export const dynamic = "force-dynamic";

export default async function RisetPublikasiPage() {
  const publications = await getPublishedPublications();

  return (
    <>
      <Hero
        title="Penelitian & Publikasi Physical Society Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Riset & Publikasi" },
        ]}
      />

      <Section padding="none">
        <Container>
          <div className="relative z-10 -mt-14 pb-16 sm:-mt-16 sm:pb-20 lg:-mt-20 lg:pb-24">
            <div className="border border-neutral-200 bg-background">
              <header className="sticky top-0 z-20 border-b border-neutral-200 bg-background px-6 py-5 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="max-w-3xl text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                    Penelitian & Publikasi Physical Society Indonesia Cabang Surabaya
                  </h1>

                  <ShareActions title="Penelitian & Publikasi Physical Society Indonesia Cabang Surabaya" />
                </div>
              </header>

              <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
                <aside className="border-b border-neutral-200 lg:border-b-0 lg:border-r">
                  <div className="lg:sticky lg:top-24">
                    <SectionNav
                      items={[
                        { label: "Semua Publikasi", href: "#semua-publikasi" },
                        { label: "Jurnal", href: "#jurnal" },
                        { label: "Prosiding", href: "#prosiding" },
                        { label: "Buku", href: "#buku" },
                        { label: "HKI", href: "#hki" },
                      ]}
                      defaultActiveHref="#semua-publikasi"
                    />
                  </div>
                </aside>

                <main className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                  <ResearchPublicationSection publications={publications} />
                </main>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <JoinCtaSection />
    </>
  );
}