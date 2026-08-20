import {
  AboutSection,
  GallerySection,
  HeroSection,
  JoinCtaSection,
  UniversitiesSection,
  EventsSection,
  LatestNewsPanel,
  StatisticsSection,
} from "@/components/features/home";

import { getUpcomingEvents } from "@/components/features/events/data";

export default async function Page() {
  const upcomingEvents = await getUpcomingEvents(3);

  return (
    <>
      <GallerySection />
      <HeroSection />
      <StatisticsSection />
      <AboutSection />
      <EventsSection events={upcomingEvents} />
      <LatestNewsPanel />
      <UniversitiesSection />
      <JoinCtaSection />
    </>
  );
}
