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

export default async function Page() {
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
        <EventsSection events={[]} />
      </ScrollReveal>

      <ScrollReveal delayMs={80}>
        <UniversitiesSection />
      </ScrollReveal>

      <JoinCtaSection />
    </>
  );
}