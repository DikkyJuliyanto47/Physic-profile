/*
 * @Author: galhkoernia 
 * @Date: 2026-08-06 18:24:23 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 18:27:21
 */

import { Container, Section, SectionHeading } from "@/components/ui";
import { milestones } from "./data";

export function HistorySection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="Sejarah" title="Perjalanan PSI Cabang Surabaya" />
        <ol className="flex flex-col gap-6 border-l border-border pl-6">
          {milestones.map((milestone) => (
            <li key={milestone.id} className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-primary-600">
                {milestone.year}
              </span>
              <span className="text-base font-semibold text-foreground">
                {milestone.title}
              </span>
              <span className="text-sm text-foreground-muted">
                {milestone.description}
              </span>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
