import { Container } from "@/components/ui";

import { statistics } from "./data";

export function StatisticsSection() {
  return (
    <section className="relative z-20 -mt-2 pb-16 sm:-mt-4 lg:pb-20">
      <Container>
        <div
          className="
            mx-auto w-full max-w-5xl
            rounded-2xl bg-primary-700
            px-6 py-6
            shadow-[0_12px_30px_rgba(15,23,42,0.10)]
            sm:px-8 sm:py-6
            lg:px-10 lg:py-5
          "
        >
          <div className="grid grid-cols-3 divide-x divide-white/20">
            {statistics.map((stat) => (
              <div
                key={stat.id}
                className="
                  flex min-w-0 flex-col items-center justify-center
                  px-2 text-center
                "
              >
                <span
                  className="
                    text-xl font-bold leading-none tracking-tight
                    tabular-nums text-white
                    sm:text-2xl
                    lg:text-3xl
                  "
                >
                  {stat.value}
                  <span aria-hidden="true">+</span>
                </span>

                <span
                  className="
                    mt-1.5 text-[11px] font-medium leading-4 text-white/95
                    sm:text-xs
                    lg:text-sm
                  "
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}