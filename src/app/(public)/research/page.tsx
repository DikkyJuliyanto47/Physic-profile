import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { publicMetadata } from "@/config/seo";
import { PublicPageShell } from "@/components/ui/index";
import { ResearchPublicationSection } from "@/components/features/research";
import { JoinCtaSection } from "@/components/features/home";
import { getPublishedPublications } from "@/components/features/research/data";

export const metadata = publicMetadata(
  "Riset & Publikasi",
  "Koleksi jurnal, prosiding, buku, dan HKI komunitas Physical Society of Indonesia Cabang Surabaya.",
  "/research",
);

export default async function RisetPublikasiPage() {
  const publications = await getPublishedPublications();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", path: "/" },
          { name: "Riset & Publikasi", path: "/research" },
        ]}
      />
      <PublicPageShell
        title="Penelitian & Publikasi Physical Society of Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Riset & Publikasi" },
        ]}
        navItems={[
          { label: "Semua Publikasi", href: "#semua-publikasi" },
          { label: "Jurnal", href: "#jurnal" },
          { label: "Prosiding", href: "#prosiding" },
          { label: "Buku", href: "#buku" },
          { label: "HKI", href: "#hki" },
        ]}
        defaultActiveHref="#semua-publikasi"
      >
        <ResearchPublicationSection publications={publications} />
      </PublicPageShell>

      <JoinCtaSection />
    </>
  );
}
