/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:20:44 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 09:36:59
 */

import {
  AboutSection,
  GallerySection,
  HeroSection,
  JoinCtaSection,
  UniversitiesSection,
  EventsSection,
  LatestNewsPanel,
} from "@/components/features/home/index";
import { getUpcomingEvents } from "@/components/features/events/data";

export default async function Page() {
  const upcomingEvents = await getUpcomingEvents(3);

  return (
    <>
      <GallerySection />
      <HeroSection />
      <AboutSection />
      <EventsSection events={upcomingEvents} />
      <LatestNewsPanel />
      <UniversitiesSection />
      <JoinCtaSection />
    </>
  );
}
