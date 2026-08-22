import { Container, Section, PageBreadcrumb } from "@/components/ui";
import { MembersSection } from "@/components/features/members";
import { prisma } from "@/lib/prisma";
import { JoinCtaSection } from "@/components/features/home";
import {
  LatestNewsWidget,
  AgendaWidget,
  CategoryWidget,
  getLatestNews,
} from "@/components/features/news";

export const dynamic = "force-dynamic";

interface MembersPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function Page({ searchParams }: MembersPageProps) {
  const { q = "" } = await searchParams;
  const keyword = q.trim();
  const [latestNews, members] = await Promise.all([
    getLatestNews(),
    prisma.memberProfile.findMany({
      where: {
        user: { isActive: true },
        ...(keyword
          ? {
              OR: [
                { user: { name: { contains: keyword, mode: "insensitive" } } },
                {
                  institution: {
                    name: { contains: keyword, mode: "insensitive" },
                  },
                },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        photoUrl: true,
        fieldOfExpertise: true,
        user: { 
              select: { 
                name: true,
                email: true,
              },
            },
        institution: { 
          select: { 
            name: true, 
            shortName: true,
            slug: true,
           },
         },
      },
      orderBy: { user: { name: "asc" } },
    }),
  ]);

  const memberItems = members.map((member) => ({
    id: member.id,
    name: member.user.name,
    email: member.user.email,
    field: member.fieldOfExpertise ?? "Belum diisi",
    institution:
      member.institution?.shortName ??
      member.institution?.name ??
      "Belum terafiliasi",
    institutionSlug: member.institution?.slug ?? "",
    photo: member.photoUrl,
  }));

  return (
    <>
      <Section padding="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start lg:gap-12">
            <div className="flex flex-col gap-8">
              <PageBreadcrumb
                items={[
                  { label: "Beranda", href: "/" },
                  { label: "Anggota" },
                ]}
              />

              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
                  ANGGOTA PSI CABANG SURABAYA
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Direktori Anggota PSI Cabang Surabaya
                </h1>

                <p className="mt-5 text-lg leading-8 text-foreground-muted">
                  Temukan anggota PSI Cabang Surabaya berdasarkan perguruan tinggi
                  dan bidang keahlian.
                </p>
              </div>

              <MembersSection members={memberItems} query={q} />
            </div>

            <aside className="flex flex-col gap-8 self-start lg:sticky lg:top-24">
              <LatestNewsWidget items={latestNews} />
              <AgendaWidget />
              <CategoryWidget />
            </aside>
          </div>
        </Container>
      </Section>

      <JoinCtaSection />
    </>
  );
}
