import { Container, Hero, Section, SectionNav, ShareActions } from "@/components/ui";

import { JoinCtaSection } from "@/components/features/home";

import {
  DocumentationGrid,
  GalleryContributionCta,
} from "@/components/features/gallery";

import type { DocumentationItem } from "@/components/features/gallery/data";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMediaPreview(
  mediaUrl: string,
  mediaType: "PHOTO" | "VIDEO",
): string {
  if (mediaType !== "VIDEO") return mediaUrl;

  const match = mediaUrl.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  return match
    ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
    : mediaUrl;
}

export default async function GaleriPage() {
  const gallery = await prisma.gallery.findMany({
    orderBy: [
      { isFeatured: "desc" },
      { sortOrder: "asc" },
      { createdAt: "desc" },
    ],
  });

  const documentationItems: DocumentationItem[] = gallery.map((item) => ({
    id: item.id,
    type: item.mediaType === "VIDEO" ? "video" : "photo",
    image: getMediaPreview(item.mediaUrl, item.mediaType),
    countLabel: item.mediaType === "VIDEO" ? "Video" : "Foto",
    date: formatDate(item.createdAt),
    title: item.title,
    location: item.category ?? "Dokumentasi PSI Surabaya",
    href: item.mediaUrl,
    description: item.description,
    isFeatured: item.isFeatured,
  }));

  return (
    <>
      <Hero
        title="Dokumentasi Kegiatan PSI Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Galeri" },
        ]}
      />

      <Section padding="none">
        <Container>
          <div className="relative z-10 -mt-14 pb-16 sm:-mt-16 sm:pb-20 lg:-mt-20 lg:pb-24">
            <div className="border border-neutral-200 bg-background">
              <header className="sticky top-0 z-20 border-b border-neutral-200 bg-background px-6 py-5 sm:px-8 lg:px-10">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <h1 className="max-w-3xl text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-3xl">
                    Dokumentasi Kegiatan PSI Cabang Surabaya
                  </h1>

                  <ShareActions title="Dokumentasi Kegiatan PSI Cabang Surabaya" />
                </div>
              </header>

              <div className="grid lg:grid-cols-[200px_minmax(0,1fr)]">
                <aside className="border-b border-neutral-200 lg:border-b-0 lg:border-r">
                  <div className="lg:sticky lg:top-24">
                    <SectionNav
                      items={[
                        { label: "Semua", href: "#semua" },
                        { label: "Foto", href: "#foto" },
                        { label: "Video", href: "#video" },
                      ]}
                      defaultActiveHref="#semua"
                    />
                  </div>
                </aside>

                <main className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                  <div className="mb-10 max-w-3xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
                      Dokumentasi PSI Cabang Surabaya
                    </p>

                    <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                      Rekam Jejak Kegiatan
                    </h2>

                    <p className="mt-4 text-base leading-7 text-foreground-muted">
                      Rekam jejak kegiatan, pertemuan, dan kolaborasi PSI
                      Cabang Surabaya bersama anggota serta mitra organisasi.
                    </p>
                  </div>

                  <DocumentationGrid items={documentationItems} />
                </main>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <GalleryContributionCta />

      <JoinCtaSection />
    </>
  );
}