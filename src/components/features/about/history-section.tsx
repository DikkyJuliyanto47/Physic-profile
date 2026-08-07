/*
 * @Author: galhkoernia 
 * @Date: 2026-08-06 18:24:23 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 19:52:11
 */

import { Container, Section, SectionHeading } from "@/components/ui";
import { milestones } from "./data";

export function HistorySection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeading eyebrow="Sejarah" title="Perjalanan PSI Cabang Surabaya" />
        <div className="relative">
          <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-border" />

          <ol className="space-y-16">
            {milestones.map((milestone, index) => (
              <li
                key={milestone.id}
                className={`relative grid items-center lg:grid-cols-2 ${
                  index % 2 === 0 ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                <div
                  className={`${
                    index % 2 === 0
                      ? "lg:pr-16 lg:text-right"
                      : "lg:pl-16"
                  }`}
                >
                  <span className="text-sm font-semibold text-primary-600">
                    {milestone.year}
                  </span>

                  <h3 className="mt-1 text-lg font-semibold">
                    {milestone.title}
                  </h3>

                  <p className="mt-2 text-sm text-foreground-muted">
                    {milestone.description}
                  </p>
                </div>

                <div className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-4 border-background bg-primary-600" />
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
