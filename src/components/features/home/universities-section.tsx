/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:16:31 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-02 09:16:31 
 */

import { Container, Section, SectionHeading } from "@/components/ui/index";
import { universities } from "./data";

const toneClasses: Record<"light" | "solid", string> = {
  light: "bg-primary-300",
  solid: "bg-primary-600",
};

export function UniversitiesSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Perguruan Tinggi"
          title="Perguruan Tinggi Anggota"
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {universities.map((university) => (
            <div
              key={university.id}
              role="img"
              aria-label="Logo perguruan tinggi anggota"
              className={`h-20 rounded-md ${toneClasses[university.tone]}`}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}
