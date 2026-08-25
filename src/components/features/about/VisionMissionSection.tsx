import { Container, Section, SectionHeading } from "@/components/ui";
import { missionPoints, visionText } from "./data";

export function VisionMissionSection() {
  return (
    <Section>
      <Container className="flex flex-col gap-8 lg:gap-9">
        <SectionHeading
          eyebrow="Visi & Misi"
          title="Visi dan Misi PSI Cabang Surabaya"
          size="large"
        />

        <div className="flex flex-col gap-6">
          <div className="relative overflow-hidden rounded-md bg-neutral-50 px-6 py-6 sm:px-8 sm:py-7">
            <div className="absolute inset-y-0 left-0 w-1 bg-primary-600" />

            <div className="pl-1">
              <h3 className="text-2xl font-bold tracking-tight text-primary-600">
                Visi
              </h3>

              <p className="mt-3 max-w-4xl text-base leading-7 text-foreground sm:text-lg sm:leading-8">
                {visionText}
              </p>
            </div>
          </div>

          <div className="rounded-md bg-neutral-100 px-6 py-6 sm:px-8 sm:py-7">
            <h3 className="text-2xl font-bold tracking-tight text-primary-600">
              Misi
            </h3>

            <ul className="mt-3 flex max-w-4xl flex-col gap-2.5">
              {missionPoints.map((point) => (
                <li
                  key={point.id}
                  className="flex gap-3 text-base leading-7 text-foreground sm:text-lg sm:leading-8"
                >
                  <span className="mt-0.5 shrink-0 text-foreground" aria-hidden="true">
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