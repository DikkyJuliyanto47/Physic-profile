/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 09:50:36 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-09 09:50:36 
 */

import {
  DocumentationGrid,
  GalleryCategorySection,
  GalleryContributionCta,
} from "@/components/features/gallery";
import { documentationItems } from "@/components/features/gallery/data";
import { PageHeader } from "@/components/ui";
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
          label: "Galeri"
        }
      ]}
      eyebrow="DOKUMENTASI PSI CABANG SURABAYA"
      title="Dokumentasi Kegiatan PSI Cabang Surabaya"
      description="Mengabadikan kegiatan, kolaborasi, dan perjalanan PSI Surabaya
              dalam membangun komunitas fisika dan pendidikan yang lebih baik."
    />
      <DocumentationGrid items={documentationItems} />
      <GalleryCategorySection />
      <GalleryContributionCta />
      <JoinCtaSection />
    </>
  );
}
