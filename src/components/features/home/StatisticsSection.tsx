import {
  Users,
  GraduationCap,
  CalendarDays,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/ui";
import { statistics } from "./data";

const STAT_ICONS: Record<string, LucideIcon> = {
  "stat-members": Users,
  "stat-universities": GraduationCap,
  "stat-activities": CalendarDays,
};

export function StatisticsSection() {
  return (
    <section className="relative overflow-hidden py-16 lg:py-24">
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_70%_45%_at_50%_0%,var(--color-primary-50),transparent_70%)]
        "
      />

      <Container>
        <div className="mx-auto grid w-full max-w-4xl gap-5 sm:grid-cols-3">
          {statistics.map((stat) => {
            const Icon = STAT_ICONS[stat.id] ?? Users;

            return (
              <div
                key={stat.id}
                className="group relative isolate"
              >
                <div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute -inset-3 -z-10
                    rounded-[1.25rem]
                    bg-primary-400/0
                    blur-2xl
                    opacity-0
                    transition-[background-color,opacity,transform]
                    duration-500 ease-out
                    motion-safe:group-hover:scale-105
                    motion-safe:group-hover:bg-primary-400/20
                    motion-safe:group-hover:opacity-100
                    motion-safe:group-focus-within:scale-105
                    motion-safe:group-focus-within:bg-primary-400/20
                    motion-safe:group-focus-within:opacity-100
                  "
                />

                <div
                  tabIndex={0}
                  className="
                    relative flex min-h-52
                    flex-col items-center justify-center
                    overflow-hidden
                    rounded-[1.125rem]
                    border border-white/80
                    bg-white
                    px-6 py-8
                    text-center
                    shadow-[0_10px_28px_rgba(15,23,42,0.07),0_2px_6px_rgba(15,23,42,0.04)]
                    outline-none
                    transition-[transform,box-shadow]
                    duration-300 ease-out
                    hover:-translate-y-1
                    hover:shadow-[0_18px_40px_rgba(15,23,42,0.11),0_4px_10px_rgba(15,23,42,0.05)]
                    focus-visible:-translate-y-1
                    focus-visible:ring-2
                    focus-visible:ring-primary-300
                    sm:min-h-56
                    sm:px-7
                  "
                >
                  <div
                    className="
                      flex h-12 w-12 items-center justify-center
                      rounded-xl
                      bg-primary-50
                      text-primary-600
                      transition-[background-color,color,box-shadow,transform]
                      duration-300 ease-out
                      group-hover:bg-primary-600
                      group-hover:text-white
                      group-hover:shadow-[0_8px_20px_rgba(29,92,184,0.20)]
                      motion-safe:group-hover:scale-105
                    "
                  >
                    <Icon
                      className="h-5 w-5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </div>

                  <div
                    className="
                      mt-6
                      text-4xl font-bold leading-none
                      tracking-[-0.04em]
                      tabular-nums
                      text-foreground
                      sm:text-5xl
                    "
                  >
                    {stat.value}
                  </div>

                  <div
                    className="
                      mt-3
                      text-xs font-semibold
                      uppercase tracking-[0.14em]
                      text-foreground-muted
                      sm:text-sm
                    "
                  >
                    {stat.label}
                  </div>

                  <div
                    aria-hidden="true"
                    className="
                      absolute bottom-0 left-1/2
                      h-0.5 w-0
                      -translate-x-1/2
                      rounded-full
                      bg-primary-500
                      transition-[width]
                      duration-300
                      group-hover:w-10
                    "
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}