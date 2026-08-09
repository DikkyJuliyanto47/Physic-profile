/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:36:05 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-09 18:50:13
 */

import {
  CollaborationCta,
  ConnectSection,
  LocationSection,
  SocialSection,
} from "@/components/features/contact";
import { PageHeader } from "@/components/ui";

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
          label: "Kontak"
        }
      ]}
      eyebrow="KONTAK & HUBUNGI KAMI"
      title="Kontak PSI Cabang Surabaya"
      description="Kontak & Hubungi Kami PSI Cabang Surabaya"
    />

      <ConnectSection />
      <CollaborationCta />
      <LocationSection />
      <SocialSection />
    </>
  );
}

