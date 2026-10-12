import { getGallery } from "@/lib/data";
import { PublicPageShell } from "@/components/ui/index";
import { JoinCtaSection } from "@/components/features/home/index";
import {
  DocumentationGrid,
  GalleryContributionCta,
} from "@/components/features/gallery";

export default async function GaleriPage() {
  const documentationItems = await getGallery();

  return (
    <>
      <PublicPageShell
        title="Dokumentasi Kegiatan Physical Society of Indonesia Cabang Surabaya"
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
        <header className="mb-6 max-w-2xl sm:mb-7">
          <h2 className="text-xl font-semibold leading-7 tracking-tight text-primary-900">
            Galeri Kegiatan
          </h2>
          <p className="mt-2 text-sm leading-6 text-foreground-muted">
            Dokumentasi berbagai kegiatan, pertemuan ilmiah, dan aktivitas
            organisasi Physical Society of Indonesia Cabang Surabaya.
          </p>
        </header>
        <DocumentationGrid items={documentationItems} />
      </PublicPageShell>

      <GalleryContributionCta />
      <JoinCtaSection />
    </>
  );
}
