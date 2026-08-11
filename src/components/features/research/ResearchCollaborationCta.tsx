/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:08:19 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:15:29
 */

import { Button, Card } from "@/components/ui";

export function ResearchCollaborationCta() {
  return (
    <Card className="flex flex-col items-start gap-6 bg-background-muted p-8 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span
          className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 sm:flex"
          aria-hidden="true"
        >
          <i className="fa-solid fa-handshake" />
        </span>
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Ingin berkolaborasi penelitian?
          </h3>
          <p className="mt-1 text-sm text-foreground-muted">
            PSI Cabang Surabaya membuka kesempatan kolaborasi riset antar
            anggota maupun dengan mitra institusi lainnya.
          </p>
        </div>
      </div>

      <Button
        href="/kontak"
        variant="secondary"
        icon={<i className="fa-solid fa-arrow-right" aria-hidden="true" />}
        iconPosition="right"
      >
        Hubungi Kami
      </Button>
    </Card>
  );
}