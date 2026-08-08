/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 08:16:48 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 09:24:07
 */

import { PageHeader } from "@/components/ui/PageHeader";
import { ManagementSection } from "@/components/features/management";
import { JoinCtaSection } from "@/components/features/home";

export default function Page() {
  return (
    <>
      <PageHeader
        breadcrumb={[
          { 
            label: "Beranda", 
            href: "/" }, 
          { 
            label: "Kepengurusan" 
          }
        ]}
        eyebrow="PENGURUS PSI CABANG SURABAYA"
        title="Pengurus PSI Cabang Surabaya"
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui."
      />
      <ManagementSection />
      <JoinCtaSection />
    </>
  );
}