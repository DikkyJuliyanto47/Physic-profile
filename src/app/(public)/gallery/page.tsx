import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { publicMetadata } from "@/config/seo";
import { getGallery } from "@/lib/data";
import { PublicPageShell } from "@/components/ui/index";
import { JoinCtaSection } from "@/components/features/home/index";
import {
  DocumentationGrid,
  GalleryContributionCta,
} from "@/components/features/gallery";

export const metadata = publicMetadata("Galeri PSI Surabaya", "Dokumentasi foto dan video kegiatan Physical Society of Indonesia Cabang Surabaya.", "/gallery");

export default async function GaleriPage() {
  const documentationItems = await getGallery();

  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Beranda", path: "/" }, { name: "Galeri", path: "/gallery" }]} />
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
