/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:07:41 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:07:41 
 */

import Link from "next/link";
import { SectionHeading } from "@/components/ui";
import { JOURNALS, type JournalAffiliation } from "./data";

const GROUP_TITLE: Record<JournalAffiliation, string> = {
  psi: "Jurnal yang dikelola oleh PSI",
  physics: "Jurnal yang berafiliasi Fisika",
};

function JournalGroup({ affiliation }: { affiliation: JournalAffiliation }) {
  const journals = JOURNALS.filter((j) => j.affiliation === affiliation);

  return (
    <div>
      <h3 className="text-sm font-semibold text-foreground">{GROUP_TITLE[affiliation]}</h3>
      <div className="mt-3 rounded-md border border-border">
        {journals.map((journal, i) => (
          <div key={journal.id} className={`p-4 ${i !== journals.length - 1 ? "border-b border-border" : ""}`}>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
              <span className="rounded bg-neutral-100 px-1.5 py-0.5 font-medium text-neutral-700">
                Dikelola PSI
              </span>
              <span className="text-foreground-muted">ISSN {journal.issn}</span>
            </div>
            <p className="mt-1.5 text-sm font-medium text-foreground">{journal.name}</p>
            <p className="mt-1 text-sm text-foreground-muted">{journal.description}</p>
            <Link href={journal.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
              Kunjungi Jurnal
              <i className="fa-solid fa-arrow-up-right-from-square ml-2 text-xs" aria-hidden="true" />
            </Link>
          </div>
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
          <Link href="/riset-publikasi/jurnal" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Lihat semua jurnal
          </Link>
        }
      />
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <JournalGroup affiliation="psi" />
        <JournalGroup affiliation="physics" />
      </div>
    </div>
  );
}