import { Container } from "@/components/ui";
import { statistics } from "./data";

export function StatisticsSection() {
  return (
    <section className="relative z-20 -mt-6 pb-12 lg:-mt-10 lg:pb-16">
      <div className="w-full bg-primary-900 shadow-xl">
        <Container className="py-8 sm:py-10">
          <div className="grid grid-cols-3 divide-x divide-white/20 text-center">
            {statistics.map((stat) => (
              <div key={stat.id} className="px-4">
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  {stat.value}
                </div>

                <div className="mt-2 text-sm text-white/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}