import { Button, Container, Section } from "@/components/ui";

import { secretariat } from "./data";

export function LocationSection() {
  return (
    <Section tone="muted" padding="compact">
      <Container>
        <div className="flex flex-col items-center border-y border-border py-12 text-center sm:py-14 lg:py-16">
          <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-primary-700">
            <i
              className="fa-solid fa-location-dot text-sm"
              aria-hidden="true"
            />
          </div>

          <p className="mt-5 text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
            Sekretariat
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {secretariat.name}
          </h3>

          <div className="mt-3 flex flex-col text-base leading-7 text-foreground-muted">
            {secretariat.addressLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </div>

          {secretariat.mapsHref ? (
            <div className="mt-7">
              <Button
                href={secretariat.mapsHref}
                variant="outline"
                size="large"
                icon={
                  <i
                    className="fa-solid fa-arrow-up-right-from-square"
                    aria-hidden="true"
                  />
                }
                iconPosition="right"
              >
                Buka di Google Maps
              </Button>
            </div>
          ) : (
            <div className="mt-7">
              <Button
                variant="outline"
                size="large"
                disabled
                icon={
                  <i
                    className="fa-solid fa-arrow-up-right-from-square"
                    aria-hidden="true"
                  />
                }
                iconPosition="right"
              >
                Buka di Google Maps
              </Button>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}