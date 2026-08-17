
import { FaUsers, FaUniversity, FaCalendarAlt } from "react-icons/fa";
import { Container, Section } from "@/components/ui/index";
import { statistics } from "./data";

const STAT_ICONS = [FaUsers, FaUniversity, FaCalendarAlt];

interface StatisticsSectionProps {
  variant?: "standalone" | "inline";
}

export function StatisticsSection({ variant = "standalone" }: StatisticsSectionProps) {
  if (variant === "inline") {
    return (
      <div className="grid grid-cols-1 divide-y divide-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {statistics.map((stat, index) => {
          const Icon = STAT_ICONS[index % STAT_ICONS.length];
          return (
            <div
              key={stat.id}
              className="flex flex-col gap-1.5 py-5 first:pt-0 sm:px-6 sm:py-0 sm:first:pl-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-foreground-muted" aria-hidden="true" />
                <span className="text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
                </span>
              </div>
              <span className="text-sm text-foreground-muted">
                {stat.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <Section tone="dark" padding="compact" className="py-6 md:py-8">
      <Container className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
        {statistics.map((stat) => (
          <div key={stat.id} className="flex flex-col gap-0">
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