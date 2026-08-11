/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:33:57 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-09 18:34:22
 */

import { Button, Container, Section } from "@/components/ui";
import { secretariat } from "./data";

export function LocationSection() {
  return (
    <Section tone="muted">
      <Container className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-6">
          <span className="text-lg font-semibold text-foreground">
            Lokasi Sekretariat
          </span>

          <div className="flex items-start gap-3">
            <i
              className="fa-solid fa-location-dot mt-1 text-primary-600"
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                {secretariat.name}
              </span>
              {secretariat.addressLines.map((line) => (
                <span key={line} className="text-sm text-foreground-muted">
                  {line}
                </span>
              ))}
            </div>
          </div>

          {secretariat.mapsHref ? (
            <Button
              href={secretariat.mapsHref}
              variant="outline"
              size="small"
              className="mt-2 w-fit"
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
              size="small"
              className="mt-2 w-fit"
              disabled
              icon={
                <i className="fa-solid fa-arrow-up-right-from-square" aria-hidden="true" />
              }
              iconPosition="right"
            >
              Buka di Google Maps
            </Button>
          )}
        </div>

        {/* Placeholder — belum ada alamat resmi untuk dipetakan, dan project
            belum memiliki konfigurasi Google Maps API. */}
        <div className="flex min-h-70 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-neutral-200 p-6 text-center">
          <i
            className="fa-solid fa-map-location-dot text-3xl text-neutral-500"
            aria-hidden="true"
          />
          <span className="max-w-xs text-sm text-foreground-muted">
            Peta akan ditampilkan setelah alamat resmi sekretariat tersedia.
          </span>
        </div>
      </Container>
    </Section>
  );
}
