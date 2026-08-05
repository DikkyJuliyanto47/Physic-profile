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
  MembersSection,
  StatisticsSection,
  UniversitiesSection,
  EventsSection,
} from "@/components/features/home/index";

export default function Page() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <StatisticsSection />
      <GallerySection />
      <EventsSection />
      <MembersSection />
      <UniversitiesSection />
      <JoinCtaSection />
    </>
  );
}