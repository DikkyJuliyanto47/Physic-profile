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
import ScrollReveal from "@/components/ui/ScrollReveal";

export default async function Page() {
  const upcomingEvents = await getUpcomingEvents(3);

  return (
    <>
      <GallerySection />

      <HeroSection />

      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <StatisticsSection />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <EventsSection events={upcomingEvents} />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <LatestNewsPanel />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <UniversitiesSection />
      </ScrollReveal>
      
        <JoinCtaSection />
    </>
  );
}