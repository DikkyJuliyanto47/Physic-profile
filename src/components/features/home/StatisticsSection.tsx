import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui";

async function getStatistics() {
  const [members, universities, activities] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.university.count(),
    prisma.event.count({
      where: {
        status: "PUBLISHED",
      },
    }),
  ]);

  return [
    {
      id: "stat-members",
      value: `${members}`,
      label: "Anggota Aktif",
    },
    {
      id: "stat-universities",
      value: `${universities}`,
      label: "Perguruan Tinggi",
    },
    {
      id: "stat-activities",
      value: `${activities}`,
      label: "Kegiatan",
    },
  ];
}

function StatisticIcon({ index }: { index: number }) {
  if (index === 0) {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-11 w-11 sm:h-12 sm:w-12"
      >
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
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-11 w-11 sm:h-12 sm:w-12"
      >
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
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-11 w-11 sm:h-12 sm:w-12"
    >
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

export async function StatisticsSection() {
  const statistics = await getStatistics();

  const decorativeCircles = [
    "right-4 top-10 h-14 w-14",
    "left-4 bottom-6 h-16 w-16",
    "right-5 bottom-5 h-12 w-12",
  ];

  return (
    <section className="bg-white py-8 sm:py-10 lg:py-12">
      <div className="relative overflow-hidden bg-primary-50/60 py-10 sm:py-12 lg:py-14">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),transparent_45%,rgba(37,99,235,0.035))]"
        />

        <Container className="relative">
          <div className="mx-auto mb-9 max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 sm:text-sm">
              Physical Society of Indonesia Cabang Surabaya
            </span>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-primary-950 sm:text-3xl">
              STATISTIK ORGANISASI
            </h2>

            <div
              aria-hidden="true"
              className="mx-auto mt-3 h-px w-12 bg-primary-500"
            />
          </div>

          <div className="mx-auto grid w-full max-w-5xl gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-7">
            {statistics.map((stat, index) => (
              <div
                key={stat.id}
                className="group relative mt-4 rounded-lg border border-primary-100 bg-white px-5 pb-5 pt-10 shadow-[0_8px_24px_rgba(15,42,75,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_12px_30px_rgba(15,42,75,0.09)] sm:pb-6 sm:pt-11"
              >
                <div className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-md border border-primary-100 bg-white text-primary-950 shadow-[0_5px_14px_rgba(15,42,75,0.10)] sm:h-14 sm:w-14">
                  <div className="scale-[0.8] sm:scale-90">
                    <StatisticIcon index={index} />
                  </div>
                </div>

                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute rounded-full bg-primary-50 transition-transform duration-500 group-hover:scale-110 ${
                    decorativeCircles[index % decorativeCircles.length]
                  }`}
                />

                <div className="relative flex min-h-28 flex-col items-center justify-center text-center sm:min-h-32">
                  <span className="text-4xl font-bold leading-none tracking-[-0.04em] text-primary-950 tabular-nums sm:text-[2.6rem] lg:text-5xl">
                    {stat.value}
                  </span>

                  <span className="mt-2.5 text-sm font-medium leading-5 text-foreground-muted sm:text-base">
                    {stat.label}
                  </span>

                  <div
                    aria-hidden="true"
                    className="mt-3 h-0.5 w-8 bg-primary-400 transition-[width] duration-300 group-hover:w-12"
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}