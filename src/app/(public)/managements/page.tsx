import { PublicPageShell } from "@/components/ui/index";
import { ManagementSection } from "@/components/features/management/ManagementSection";
import { managementGroups } from "@/components/features/management/data";
import { JoinCtaSection } from "@/components/features/home";

export default function Page() {
  return (
    <>
      <PublicPageShell
        title="Kepengurusan Physical Society Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Kepengurusan" },
        ]}
        navItems={managementGroups.map((group) => ({
          label: group.title,
          href: `#${group.id}`,
        }))}
        defaultActiveHref={
          managementGroups[0] ? `#${managementGroups[0].id}` : undefined
        }
      >
        <ManagementSection groups={managementGroups} />
      </PublicPageShell>

      <JoinCtaSection />
    </>
  );
}