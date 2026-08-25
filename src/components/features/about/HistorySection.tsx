import { SectionHeading } from "@/components/ui";

interface HistoryData {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: string[];
}

interface HistorySectionProps {
  data: HistoryData;
}

export function HistorySection({ data }: HistorySectionProps) {
  return (
    <section id={data.id} className="scroll-mt-28 border-t border-neutral-200 py-12 sm:py-14 lg:py-16">
      <div className="flex flex-col gap-6">
        <SectionHeading eyebrow={data.eyebrow} title={data.title} />

        <div className="max-w-3xl space-y-5 text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
          {data.paragraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}