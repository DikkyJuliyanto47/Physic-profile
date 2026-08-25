import { SectionHeading } from "@/components/ui";
import { missionPoints, visionText } from "./data";

interface VisionMissionSectionProps {
  visionText?: string;
  missionPoints?: Array<{ id: string; text: string }>;
}

export function VisionMissionSection({
  visionText: propVisionText,
  missionPoints: propMissionPoints,
}: VisionMissionSectionProps) {
  const displayVision = propVisionText ?? visionText;
  const displayMissions = propMissionPoints ?? missionPoints;

  return (
    <section id="visi-misi" className="scroll-mt-28 border-t border-neutral-200 py-12 sm:py-14 lg:py-16">
      <div className="flex flex-col gap-10">
        <SectionHeading eyebrow="Visi & Misi" title="Visi dan Misi PSI Cabang Surabaya" />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="border-l-2 border-primary-600 pl-5 sm:pl-6">
            <h3 className="text-xl font-bold tracking-tight text-primary-800 sm:text-2xl">Visi</h3>
            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
              {displayVision}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold tracking-tight text-primary-800 sm:text-2xl">Misi</h3>

            <ul className="mt-4 flex max-w-2xl flex-col gap-4">
              {displayMissions.map((point) => (
                <li key={point.id} className="flex gap-3 text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
                  <span className="mt-3 h-1.5 w-1.5 shrink-0 bg-primary-600" aria-hidden="true" />
                  <span>{point.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}