import { getActiveManagement } from "@/lib/data";
import { PublicPageShell } from "@/components/ui/index";
import { ManagementSection } from "@/components/features/management/ManagementSection";
import { JoinCtaSection } from "@/components/features/home";

function normalizeSearch(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const value = Array.isArray(q) ? q[0] : q;
  const query = typeof value === "string" ? normalizeSearch(value) : "";
  const keyword = query.toLowerCase();
  const groups = await getActiveManagement();
  const managementGroups = keyword
    ? groups.map((group) => ({
        ...group,
        members: group.members.filter((member) =>
          [member.name, member.role].some((value) =>
            normalizeSearch(value).toLowerCase().includes(keyword),
          ),
        ),
      })).filter((group) => group.members.length > 0)
    : groups;

  return (
    <>
      <PublicPageShell
        title="Kepengurusan Physical Society of Indonesia Cabang Surabaya"
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
        <ManagementSection groups={managementGroups} query={query} />
      </PublicPageShell>

      <JoinCtaSection />
    </>
  );
}
