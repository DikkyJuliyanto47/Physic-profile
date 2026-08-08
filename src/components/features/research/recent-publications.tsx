/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:08:00 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:12:19
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { Badge, Card, SectionHeading } from "@/components/ui";
import {
  PUBLICATIONS,
  PUBLICATION_FILTERS,
  type Publication,
  type PublicationCategory,
} from "./data";

const CATEGORY_ICON: Record<PublicationCategory, string> = {
  buku: "fa-book",
  hki: "fa-lightbulb",
  jurnal: "fa-file-lines",
  prosiding: "fa-layer-group",
};

const CATEGORY_LABEL: Record<PublicationCategory, string> = {
  buku: "Buku",
  hki: "HKI",
  jurnal: "Jurnal",
  prosiding: "Prosiding",
};

const CATEGORY_TONE: Record<PublicationCategory, "primary" | "neutral" | "dark"> = {
  buku: "dark",
  hki: "primary",
  jurnal: "neutral",
  prosiding: "primary",
};

function PublicationCard({ publication }: { publication: Publication }) {
  return (
    <Card className="flex min-w-60 flex-1 flex-col p-5">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-50 text-primary-600"
        aria-hidden="true"
      >
        <i className={`fa-solid ${CATEGORY_ICON[publication.category]}`} />
      </span>
      <div className="mt-3">
        <Badge tone={CATEGORY_TONE[publication.category]}>
          {CATEGORY_LABEL[publication.category]}
        </Badge>
      </div>
      <h4 className="mt-2 text-sm font-semibold leading-snug text-foreground">
        {publication.title}
      </h4>
      <ul className="mt-2 space-y-0.5 text-xs text-foreground-muted">
        {publication.meta.map((line) => (
          <li key={line}>{line}</li>
        ))}
      </ul>
      <Link
        href={publication.href}
        className="mt-4 border-t border-border pt-3 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        Lihat Detail
        <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
      </Link>
    </Card>
  );
}

export function RecentPublications() {
  const [activeFilter, setActiveFilter] = useState<(typeof PUBLICATION_FILTERS)[number]["id"]>(
    "semua"
  );

  const filtered =
    activeFilter === "semua"
      ? PUBLICATIONS
      : PUBLICATIONS.filter((publication) => publication.category === activeFilter);

  return (
    <div>
      <SectionHeading
        title="Publikasi Terbaru"
        action={
          <Link
            href="/riset-publikasi/publikasi"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Lihat semua publikasi
            <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
          </Link>
        }
      />

      <div
        role="tablist"
        aria-label="Filter kategori publikasi"
        className="mt-6 flex flex-wrap gap-2"
      >
        {PUBLICATION_FILTERS.map((filter) => {
          const isActive = filter.id === activeFilter;
          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveFilter(filter.id)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "bg-background-muted text-foreground-muted hover:text-foreground"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="mt-6 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
        {filtered.map((publication) => (
          <PublicationCard key={publication.id} publication={publication} />
        ))}
      </div>
    </div>
  );
}