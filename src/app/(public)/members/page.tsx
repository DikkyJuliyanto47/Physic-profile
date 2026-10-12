import { getMembers } from "@/lib/data";
import { PublicPageShell } from "@/components/ui/index";
import { MembersSection } from "@/components/features/members";
import { UniversityDirectory } from "@/components/features/members/UniversityDirectory";
import { JoinCtaSection } from "@/components/features/home";

export default async function Page() {
  const members = await getMembers();

  const institutions = Array.from(
    new Set(members.map((member) => member.institution)),
  );

  return (
    <div className="[&_aside_nav_ul]:border-t-0 [&_aside_nav_a]:px-4 [&_aside_nav_a]:py-3 [&_aside_nav_a]:text-sm [&_aside_nav_a]:leading-5 [&_aside_nav_a]:wrap-anywhere [&_aside_nav_a:focus-visible]:outline-2 [&_aside_nav_a:focus-visible]:-outline-offset-2 [&_aside_nav_a:focus-visible]:outline-primary-700">
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
        <MembersSection
          members={members}
          universityDirectory={<UniversityDirectory />}
        />
      </PublicPageShell>

      <JoinCtaSection />
    </div>
  );
}
