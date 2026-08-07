/*
 * @Author: galhkoernia 
 * @Date: 2026-08-07 19:32:03 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 22:50:00
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { VisionMissionSection} from "@/components/features/about";
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
          label: "Tentang Kami",
        },
      ]}
      eyebrow="TENTANG KAMI"
      title="Sekilas tentang PSI Cabang Surabaya"
      description="Mengenal sejarah, visi-misi, dan nilai yang menjadi landasan Physical Society of Indonesia Cabang Surabaya."
    />

      <VisionMissionSection />
      <JoinCtaSection />
    </>
  );
}