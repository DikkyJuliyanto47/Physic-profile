import { Container } from "@/components/ui";
import { statistics } from "./data";

function StatisticIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 sm:h-16 sm:w-16">
        <path
          d="M12 24 32 12l20 12-20 12-20-12Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M20 29v12c3.5 4 7.5 6 12 6s8.5-2 12-6V29M32 36v12M25 50h14"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path
          d="M52 24v13"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (index === 1) {
    return (
      <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 sm:h-16 sm:w-16">
        <path
          d="M16 28h32M20 28v20M28 28v20M36 28v20M44 28v20M13 48h38"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12 25h40l-4-9H16l-4 9ZM30 16v-6h4v6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className="h-14 w-14 sm:h-16 sm:w-16">
      <path
        d="m34 9 4 9 10 1-7.5 6.5 2.5 10-9-5-9 5 2.5-10L20 19l10-1 4-9Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M25 38c-4 3-7 7-7 12h28c0-5-3-9-7-12M24 50h16"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="M28 42h8"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StatisticsSection() {
  return (
    <section className="bg-background py-10 sm:py-12 lg:py-14">
      <Container>
        <div className="mx-auto grid w-full max-w-5xl gap-5 sm:grid-cols-3 sm:gap-6 lg:gap-7">
          {statistics.map((stat, index) => (
            <div
              key={stat.id}
              className="group relative mt-5 rounded-[1.35rem] border border-border/70 bg-white px-5 pb-7 pt-11 shadow-[0_8px_28px_rgba(15,23,42,0.07)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_14px_34px_rgba(15,23,42,0.1)] sm:pb-8 sm:pt-12 lg:pb-9"
            >
              <div className="absolute left-1/2 top-0 flex h-11 min-w-19 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary-950 px-5 text-sm font-semibold text-white shadow-[0_5px_14px_rgba(15,23,42,0.14)]">
                PSI
              </div>

              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-3 h-14 w-14 rounded-full bg-primary-50 transition-transform duration-500 group-hover:scale-125"
              />

              <div className="relative flex min-h-40 flex-col items-center justify-center text-center sm:min-h-44">
                <div className="flex h-16 w-16 items-center justify-center text-primary-950">
                  <StatisticIcon index={index} />
                </div>

                <span className="mt-5 text-4xl font-bold leading-none tracking-[-0.04em] text-primary-950 tabular-nums sm:text-[2.75rem] lg:text-5xl">
                  {stat.value}
                </span>

                <span className="mt-3 text-sm font-medium leading-5 text-foreground-muted sm:text-base">
                  {stat.label}
                </span>

                <div
                  aria-hidden="true"
                  className="mt-4 h-0.5 w-8 bg-primary-300 transition-all duration-300 group-hover:w-12"
                />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}