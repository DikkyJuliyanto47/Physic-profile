/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 08:37:52 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:39:40
 */

import { Container, Section } from "@/components/ui/index";
import { statistics } from "./data";

export function StatisticsSection() {
  return (
    <Section tone="dark" padding="compact">
      <Container className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
        {statistics.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-1">
            <span className="text-3xl font-bold text-white sm:text-4xl">
              {stat.value}
            </span>
            <span className="text-sm text-white/70">{stat.label}</span>
          </div>
        ))}
      </Container>
    </Section>
  );
}
