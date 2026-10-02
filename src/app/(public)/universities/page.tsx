import { getMembers } from "@/lib/data";
import { PublicPageShell } from "@/components/ui/index";
import { MembersSection } from "@/components/features/members";
import { JoinCtaSection } from "@/components/features/home";
import { UniversitiesSection } from "@/components/features/universities/UniversitiesSection";

function getInstitutionId(institution: string) {
  return institution
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default async function Page() {
  const members = await getMembers();

  const institutions = Array.from(
    new Set(members.map((member) => member.institution)),
  );

  const navItems = [
    ...institutions.map((institution) => ({
      label: institution,
      href: `#${getInstitutionId(institution)}`,
    })),
    {
      label: "Perguruan Tinggi",
      href: "#perguruan-tinggi",
    },
  ];

  return (
    <>
      <PublicPageShell
        title="Anggota Physical Society of Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Anggota" },
        ]}
        navItems={navItems}
        defaultActiveHref={
          institutions[0] ? `#${getInstitutionId(institutions[0])}` : "#perguruan-tinggi"
        }
      >
        <MembersSection members={members} />
        <UniversitiesSection />
      </PublicPageShell>

      <JoinCtaSection />
    </>
  );
}