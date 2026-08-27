import { PublicPageShell } from "@/components/ui/index";
import { ResearchPublicationSection } from "@/components/features/research";
import { JoinCtaSection } from "@/components/features/home";
import { getPublishedPublications } from "@/components/features/research/data";
import type { Publication } from "@/components/features/research/types";

export const dynamic = "force-dynamic";

export default async function RisetPublikasiPage() {
  // Production: aktifkan kembali query publikasi dari database.
  // const publications = await getPublishedPublications();

  // Development: dummy data sementara untuk memoles dan menguji UI.
  const publications: Publication[] = [
    {
      id: "journal-1",
      category: "JURNAL",
      title: "Advances in Materials Physics for Sustainable Energy Applications",
      meta: ["International Journal of Applied Physics", "2026"],
      href: "#",
    },
    {
      id: "journal-2",
      category: "JURNAL",
      title: "Computational Modeling of Complex Physical Systems in Emerging Technologies",
      meta: ["Journal of Physics and Computational Science", "2025"],
      href: "#",
    },
    {
      id: "proceeding-1",
      category: "PROSIDING",
      title: "Recent Developments in Experimental and Computational Physics",
      meta: ["Proceedings of National Physics Conference", "2025"],
      href: "#",
    },
    {
      id: "proceeding-2",
      category: "PROSIDING",
      title: "Physics for Sustainable Technology and Environmental Applications",
      meta: ["Proceedings of Applied Physics Symposium", "2024"],
      href: "#",
    },
    {
      id: "book-1",
      category: "BUKU",
      title: "Pengantar Fisika Modern untuk Pendidikan dan Penelitian",
      meta: ["PSI Cabang Surabaya", "2025"],
      href: "#",
    },
    {
      id: "hki-1",
      category: "HKI",
      title: "Sistem Instrumentasi Eksperimental untuk Pengukuran Parameter Fisis",
      meta: ["Hak Kekayaan Intelektual", "2024"],
      href: "#",
    },
  ];

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