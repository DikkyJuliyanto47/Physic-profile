import { Button, Container, Section } from "@/components/ui";
import { secretariat } from "./data";

export function LocationSection() {
  return (
    <Section tone="muted" padding="compact">
      <Container>
        <div className="border-y border-border py-12 sm:py-14 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-12">
            <div>
              <div className="flex h-10 w-10 items-center justify-center border border-border bg-background text-primary-700">
                <i className="fa-solid fa-location-dot text-sm" aria-hidden="true" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-primary-700 sm:text-sm">
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
            </div>

            <div>
              <Button
                href={secretariat.mapsHref || undefined}
                variant="outline"
                size="large"
                disabled={!secretariat.mapsHref}
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
          </div>
        </div>
      </Container>
    </Section>
  );
}