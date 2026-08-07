/*
 * @Author: galhkoernia 
 * @Date: 2026-08-06 18:24:23 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 18:29:31
 */

import { Container, Section, SectionHeading } from "@/components/ui";
import { values } from "./data";

export function ValuesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="Nilai Kami" title="Nilai yang Kami Pegang" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value) => (
            <div
              key={value.id}
              className="flex flex-col gap-2 rounded-lg bg-background-muted p-4"
            >
              <span className="h-8 w-8 rounded-md bg-primary-600" />
              <span className="text-sm font-semibold text-foreground">
                {value.title}
              </span>
              <span className="text-xs text-foreground-muted">
                {value.description}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
