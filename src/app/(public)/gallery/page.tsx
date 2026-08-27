import { PublicPageShell } from "@/components/ui/index";
import { JoinCtaSection } from "@/components/features/home/index";
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
      <PublicPageShell
        title="Dokumentasi Kegiatan PSI Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Galeri" },
        ]}
        navItems={[
          { label: "Semua", href: "#semua" },
          { label: "Foto", href: "#foto" },
          { label: "Video", href: "#video" },
        ]}
        defaultActiveHref="#semua"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
            Dokumentasi PSI Cabang Surabaya
          </p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Rekam Jejak Kegiatan
          </h2>
          <p className="mt-4 text-base leading-7 text-foreground-muted">
            Rekam jejak kegiatan, pertemuan, dan kolaborasi PSI Cabang Surabaya
            bersama anggota serta mitra organisasi.
          </p>
        </div>

        <DocumentationGrid items={documentationItems} />
      </PublicPageShell>

      <GalleryContributionCta />
      <JoinCtaSection />
    </>
  );
}