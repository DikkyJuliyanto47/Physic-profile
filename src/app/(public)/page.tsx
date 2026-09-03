import {
  AboutSection,
  EventsSection,
  GallerySection,
  JoinCtaSection,
  LatestNewsPanel,
  StatisticsSection,
  UniversitiesSection,
} from "@/components/features/home";
import ScrollReveal from "@/components/ui/ScrollReveal";
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

      <ScrollReveal delayMs={80}>
        <StatisticsSection />
      </ScrollReveal>

      <div className="-mt-8">
        <ScrollReveal delayMs={80}>
          <LatestNewsPanel />
        </ScrollReveal>
      </div>

      <ScrollReveal delayMs={80}>
        <EventsSection events={events} />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <UniversitiesSection universities={universities} />
      </ScrollReveal>

      <JoinCtaSection />
    </>
  );
}