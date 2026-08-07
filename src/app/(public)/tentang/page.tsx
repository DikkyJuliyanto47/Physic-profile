/*
 * @Author: galhkoernia 
 * @Date: 2026-08-07 19:32:03 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 19:36:10
 */

import { PageHeader } from "@/components/ui/PageHeader";
import {
  HistorySection,
  ValuesSection,
  VisionMissionSection,
} from "@/components/features/about";
import { JoinCtaSection } from "@/components/features/home";

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Tentang Kami"
        title="Tentang PSI Cabang Surabaya"
        description="Mengenal sejarah, visi-misi, dan nilai yang menjadi landasan Physical Society of Indonesia Cabang Surabaya."
    />

      <HistorySection />
      <VisionMissionSection />
      <ValuesSection />
      <JoinCtaSection />
    </>
  );
}