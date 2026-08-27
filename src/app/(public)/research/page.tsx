import { PublicPageShell } from "@/components/ui/index";
import { ResearchPublicationSection } from "@/components/features/research";
import { JoinCtaSection } from "@/components/features/home";
import { getPublishedPublications } from "@/components/features/research/data";

export const dynamic = "force-dynamic";

export default async function RisetPublikasiPage() {
  const publications = await getPublishedPublications();

  return (
    <>
      <PublicPageShell
        title="Penelitian & Publikasi Physical Society Indonesia Cabang Surabaya"
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