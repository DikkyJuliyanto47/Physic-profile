import { Container, Section } from "@/components/ui";
import { contactChannels } from "./data";

export function ConnectSection() {
  return (
    <Section padding="compact">
      <Container>
        <div className="mb-9 max-w-2xl sm:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 sm:text-sm">
            Hubungi Kami
          </p>
          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Kanal Komunikasi
          </h2>
          <div className="mt-4 h-px w-12 bg-primary-400" />
        </div>

        <div className="grid gap-5 sm:grid-cols-3 lg:gap-6">
          {contactChannels.map((channel, index) => (
            <div
              key={channel.id}
              className="group relative overflow-hidden rounded-2xl border border-border/70 bg-white px-6 py-7 shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-[0_14px_32px_rgba(15,23,42,0.1)] sm:px-7 sm:py-8"
            >
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute ${
                  index === 0
                    ? "-right-8 -top-8 h-24 w-24"
                    : index === 1
                      ? "-bottom-10 -left-10 h-28 w-28"
                      : "-right-6 bottom-4 h-16 w-16"
                } rounded-full bg-primary-50 transition-transform duration-500 group-hover:scale-110`}
              />

              <div className="relative">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-primary-100 bg-primary-50 text-primary-700 shadow-sm">
                  <i
                    className={`${channel.icon} text-base`}
                    aria-hidden="true"
                  />
                </div>

                <span className="mt-6 block text-base font-semibold text-foreground">
                  {channel.label}
                </span>

                <span className="mt-1.5 block text-sm leading-6 text-foreground-muted">
                  {channel.value}
                </span>

                {channel.href ? (
                  <a
                    href={channel.href}
                    className="mt-5 inline-flex items-center text-sm font-semibold text-primary-700 transition-colors hover:text-primary-800"
                  >
                    {channel.actionLabel}
                    <span
                      className="ml-2 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                ) : (
                  <span className="mt-5 block text-sm text-foreground-muted/70">
                    Segera tersedia
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}