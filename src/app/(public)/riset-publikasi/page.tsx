/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:05:21 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:12:55
 */

import { PageHeader } from "@/components/ui";
import { ResearchPublicationSection } from "@/components/features/research/index";

export default function RisetPublikasiPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { label: "Beranda", href: "/" },
          { label: "Penelitian & Publikasi" },
        ]}
        eyebrow="PENELITIAN & PUBLIKASI"
        title="Pusat Penelitian dan Publikasi"
        description="Pusat informasi penelitian, publikasi ilmiah, HKI, buku, prosiding, dan kolaborasi penelitian anggota PSI."
      />

      <ResearchPublicationSection />
    </>
  );
}