/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:07:41 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:07:41 
 */

import Link from "next/link";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { JOURNALS, type JournalAffiliation } from "./data";

const GROUP_TITLE: Record<JournalAffiliation, string> = {
  psi: "Jurnal yang dikelola oleh PSI",
  physics: "Jurnal yang berafiliasi Fisika",
};

const GROUP_BADGE: Record<JournalAffiliation, { label: string; tone: "primary" | "neutral" }> = {
  psi: { label: "Dikelola PSI", tone: "primary" },
  physics: { label: "Afiliasi Fisika", tone: "neutral" },
};

function JournalGroup({ affiliation }: { affiliation: JournalAffiliation }) {
  const journals = JOURNALS.filter((journal) => journal.affiliation === affiliation);
  const badge = GROUP_BADGE[affiliation];

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">
        {GROUP_TITLE[affiliation]}
      </h3>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {journals.map((journal) => (
          <Card key={journal.id} className="flex gap-4 p-5">
            <span
              className="flex h-16 w-12 shrink-0 items-center justify-center rounded-md bg-primary-950 text-primary-200"
              aria-hidden="true"
            >
              <i className="fa-solid fa-book-open" />
            </span>
            <div className="flex flex-1 flex-col">
              <h4 className="text-sm font-semibold leading-snug text-foreground">
                {journal.name}
              </h4>
              <div className="mt-1">
                <Badge tone={badge.tone}>{badge.label}</Badge>
              </div>
              <p className="mt-1 text-xs text-foreground-muted">
                ISSN {journal.issn}
              </p>
              <p className="mt-2 text-sm text-foreground-muted">
                {journal.description}
              </p>
              <Link
                href={journal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                Kunjungi Jurnal
                <i
                  className="fa-solid fa-arrow-up-right-from-square ml-2 text-xs"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function JournalDirectory() {
  return (
    <div>
      <SectionHeading
        title="Jurnal Ilmiah"
        action={
          <Link
            href="/riset-publikasi/jurnal"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Lihat semua jurnal
            <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-8 space-y-8">
        <JournalGroup affiliation="psi" />
        <JournalGroup affiliation="physics" />
      </div>
    </div>
  );
}