/*
 * @Author: galhkoernia 
 * @Date: 2026-08-06 18:24:23 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 19:54:03
 */

import { Card, Container, Section, SectionHeading } from "@/components/ui";
import { missionPoints, visionText } from "./data";

export function VisionMissionSection() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="Visi & Misi" title="Arah dan Komitmen Organisasi" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Visi
            </span>
            <p className="mt-3 text-foreground-muted">{visionText}</p>
          </Card>
          <Card>
            <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
              Misi
            </span>
            <ol className="mt-3 flex flex-col gap-3">
              {missionPoints.map((point, index) => (
                <li key={point.id} className="flex gap-3 text-sm text-foreground-muted">
                  <span className="font-semibold text-primary-600">
                    {index + 1}.
                  </span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
