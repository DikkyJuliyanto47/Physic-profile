import { SectionHeading } from "@/components/ui";
import { aboutData, historyData, missionPoints, visionText } from "./data";
import { HistorySection } from "./HistorySection";
import { VisionMissionSection } from "./VisionMissionSection";

export function AboutSection() {
  return (
    <div>
      <section id={aboutData.id} className="scroll-mt-28 pb-12 sm:pb-14 lg:pb-16">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={aboutData.eyebrow} title={aboutData.title} />

          <div className="max-w-3xl space-y-5 text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
            {aboutData.paragraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <HistorySection data={historyData} />

      <VisionMissionSection visionText={visionText} missionPoints={missionPoints} />
    </div>
  );
}