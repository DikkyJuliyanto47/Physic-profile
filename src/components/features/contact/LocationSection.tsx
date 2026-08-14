/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:33:57 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 20:00:00
 */

import { Button, Container, Section } from "@/components/ui";
import { secretariat } from "./data";

export function LocationSection() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-5 text-center">
        <i
          className="fa-solid fa-location-dot text-3xl text-primary-600"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-1">
          <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
            Lokasi
          </h3>
          <span className="text-base font-semibold text-foreground">
            {secretariat.name}
          </span>
          {secretariat.addressLines.map((line) => (
            <span key={line} className="max-w-xl text-base text-foreground-muted">
              {line}
            </span>
          ))}
        </div>

        {secretariat.mapsHref ? (
          <Button
            href={secretariat.mapsHref}
            variant="outline"
            size="large"
            icon={
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            }
            iconPosition="right"
          >
            Buka di Google Maps
          </Button>
        ) : (
          <Button
            variant="outline"
            size="large"
            disabled
            icon={
              <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
            }
            iconPosition="right"
          >
            Buka di Google Maps
          </Button>
        )}
      </Container>
    </Section>
  );
}