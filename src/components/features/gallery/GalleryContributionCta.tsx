/*
 * @Author: galhkoernia
 * @Date: 2026-08-09 09:48:51
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 15:00:00
 */

import { Button, Container, Section } from "@/components/ui";

export function GalleryContributionCta() {
  return (
    <Section padding="compact">
      <Container>
        <div className="flex flex-col items-start gap-5 rounded-lg border border-border bg-background-muted p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary-100 text-primary-600">
              <i className="fa-regular fa-images" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-base font-semibold text-foreground">
                Punya dokumentasi kegiatan PSI Surabaya?
              </span>
              <span className="max-w-xl text-sm text-foreground-muted">
                Bagikan momen terbaik Anda kepada kami untuk diabadikan di
                galeri resmi PSI Surabaya.
              </span>
            </div>
          </div>

          <Button
            href="/kontak"
            icon={<i className="fa-solid fa-arrow-right" aria-hidden="true" />}
            iconPosition="right"
            className="shrink-0"
          >
            Kirim Dokumentasi
          </Button>
        </div>
      </Container>
    </Section>
  );
}