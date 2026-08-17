import { Container, Section, SectionHeading } from "@/components/ui";
import { missionPoints, visionText } from "./data";

export function VisionMissionSection() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Visi & Misi"
          title="Visi dan Misi PSI Cabang Surabaya"
        />

        <div className="flex flex-col gap-6">
          <div className="rounded-lg bg-primary-50 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-primary-600 sm:text-3xl">
              Visi
            </h3>
            <p className="mt-3 max-w-3xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
              {visionText}
            </p>
          </div>

          <div className="rounded-lg bg-neutral-100 p-6 sm:p-8">
            <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
              Misi
            </h3>
            <ul className="mt-3 flex flex-col gap-2.5">
              {missionPoints.map((point) => (
                <li
                  key={point.id}
                  className="flex gap-2.5 text-sm leading-6 text-foreground-muted sm:text-base sm:leading-7"
                >
                  <span className="mt-0.5 shrink-0 text-primary-600" aria-hidden="true">
                    •
                  </span>
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </Section>
  );
}