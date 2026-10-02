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
        <DocumentationGrid items={documentationItems} />
      </PublicPageShell>

      <GalleryContributionCta />
      <JoinCtaSection />
    </>
  );
}
