import { getMembers } from "@/lib/data";
import { PublicPageShell } from "@/components/ui/index";
import { MembersSection } from "@/components/features/members";
import { JoinCtaSection } from "@/components/features/home";

export default async function Page() {
  const members = await getMembers();

  const institutions = Array.from(
    new Set(members.map((member) => member.institution)),
  );

  return (
    <>
      <PublicPageShell
        title="Anggota Physical Society of Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Anggota" },
        ]}
        navItems={[
          ...institutions.map((institution) => ({
            label: institution,
            href: `#${institution
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-")
              .replace(/^-|-$/g, "")}`,
          })),
          {
            label: "Perguruan Tinggi",
            href: "#perguruan-tinggi",
          },
        ]}
        defaultActiveHref={
          institutions[0]
            ? `#${institutions[0]
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")}`
            : undefined
        }
      >
        <MembersSection members={members} />
      </PublicPageShell>

      <JoinCtaSection />
    </>
  );
}