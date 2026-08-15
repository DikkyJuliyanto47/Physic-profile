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

export default function Page() {
  return (
    <>
      <GallerySection />
      <HeroSection />
      <AboutSection />
      <EventsSection />
      <LatestNewsPanel />
      <UniversitiesSection />
      <JoinCtaSection />
    </>
  );
}