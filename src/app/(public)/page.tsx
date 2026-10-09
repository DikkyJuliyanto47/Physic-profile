import {
  AboutSection,
  EventsSection,
  GallerySection,
  JoinCtaSection,
  LatestNewsPanel,
  StatisticsSection,
  UniversitiesSection,
} from "@/components/features/home";

import { prisma } from "@/lib/prisma";

export default async function Page() {
  const [events, universities] = await Promise.all([
    prisma.event.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        startDate: "desc",
      },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        startDate: true,
        location: true,
      },
    }),
    prisma.university.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        deptUrl: true,
        websiteUrl: true,
      },
    }),
  ]);

  return (
    <>
      <GallerySection />
      <AboutSection />
      <StatisticsSection />

      <LatestNewsPanel />
      <EventsSection events={events} />

      <UniversitiesSection universities={universities} />

      <JoinCtaSection />
    </>
  );
}