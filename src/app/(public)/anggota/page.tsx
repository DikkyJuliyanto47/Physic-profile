/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 09:24:00 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 09:25:02
*/

import { PageHeader } from "@/components/ui/PageHeader";
import { MembersSection } from "@/components/features/members";
import { JoinCtaSection } from "@/components/features/home";

export default function Page() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          {
            label: "Beranda",
            href: "/",
          },
          {
            label: "Anggota",
          },
        ]}
        eyebrow="ANGGOTA PSI CABANG SURABAYA"
        title="Direktori Anggota PSI Cabang Surabaya"
        description="Temukan anggota PSI Cabang Surabaya berdasarkan perguruan tinggi dan bidang keahlian."
      />

      <MembersSection />

      <JoinCtaSection />
    </>
  );
}