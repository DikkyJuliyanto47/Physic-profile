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
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
            Dokumentasi Physical Society of Indonesia Cabang Surabaya
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
