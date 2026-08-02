/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:11:53 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-02 09:11:53 
 */

import { Container, Section, SectionHeading } from "@/components/ui/index";
import { upcomingAgenda } from "./data";

export function EventsSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="Agenda Kegiatan" title="Agenda Terdekat" />
        <div className="grid gap-6 border-t border-border pt-8 sm:grid-cols-3">
          {upcomingAgenda.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-lg border border-border"
            >
              <div className="h-10 bg-primary-50" />
              <div className="h-32 bg-background" />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
