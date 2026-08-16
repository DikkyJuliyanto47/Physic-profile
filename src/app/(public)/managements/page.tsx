/*
 * @Author: galhkoernia
 * @Date: 2026-08-08 08:16:48
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 15:00:00
 */

import { Container, Section, PageBreadcrumb } from "@/components/ui";
import { ManagementSection } from "@/components/features/management";
import { prisma } from "@/lib/prisma";
import { JoinCtaSection } from "@/components/features/home";
import {
  LatestNewsWidget,
  AgendaWidget,
  CategoryWidget,
  getLatestNews,
} from "@/components/features/news";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [latestNews, activePeriod] = await Promise.all([
    getLatestNews(),
    prisma.managementPeriod.findFirst({
      where: { isActive: true },
      include: {
        positions: {
          orderBy: [{ department: "asc" }, { order: "asc" }, { createdAt: "asc" }],
          include: {
            memberProfile: {
              include: {
                user: { select: { name: true } },
                institution: { select: { name: true, shortName: true } },
              },
            },
          },
        },
      },
    }),
  ]);

  const groups = Array.from(
    (activePeriod?.positions ?? []).reduce((result, position) => {
      const department = position.department?.trim() || "Struktur Umum";
      const group = result.get(department) ?? {
        id: department.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
        title: department,
        members: [],
      };

      group.members.push({
        id: position.id,
        name: position.memberProfile?.user.name ?? "Belum ditetapkan",
        role: position.title,
        description:
          position.memberProfile?.institution?.shortName ??
          position.memberProfile?.institution?.name ??
          position.title,
      });
      result.set(department, group);
      return result;
    }, new Map<string, { id: string; title: string; members: { id: string; name: string; role: string; description: string }[] }>()).values(),
  );

  return (
    <>
      <Section padding="compact">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(300px,1fr)] lg:items-start lg:gap-12">
            <div className="flex flex-col gap-8">
              <PageBreadcrumb
                items={[
                  { label: "Beranda", href: "/" },
                  { label: "Kepengurusan" },
                ]}
              />

              <div className="max-w-3xl">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
                  PENGURUS PSI CABANG SURABAYA
                </p>

                <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
                  Pengurus PSI Cabang Surabaya
                </h1>

                <p className="mt-5 text-lg leading-8 text-foreground-muted">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Vestibulum ac diam sit amet quam vehicula elementum sed sit
                  amet dui.
                </p>
              </div>

              <ManagementSection groups={groups} />
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
