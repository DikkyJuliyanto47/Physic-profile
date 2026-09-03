"use client";

import { useMemo, useState } from "react";
import type { Publication, PublicationStatus } from "./types";

const CATEGORY_ORDER: PublicationStatus[] = [
  "JURNAL",
  "BUKU",
  "HKI",
  "PROSIDING",
];

const CATEGORY_LABEL: Record<PublicationStatus, string> = {
  BUKU: "Buku",
  HKI: "HKI",
  JURNAL: "Jurnal",
  PROSIDING: "Prosiding",
};

function getCategoryId(category: PublicationStatus) {
  return category.toLowerCase();
}

function getCategoryCount(
  publications: Publication[],
  category: PublicationStatus,
) {
  return publications.filter(
    (publication) => publication.category === category,
  ).length;
}

function PublicationItem({
  publication,
  index,
}: {
  publication: Publication;
  index: number;
}) {
  const year = publication.meta.at(-1);
  const source =
    publication.meta.length > 1
      ? publication.meta.slice(0, -1)
      : publication.meta;

  return (
    <article className="group border-b border-neutral-200 bg-white px-5 py-5 last:border-b-0 lg:px-6">
      <div className="grid items-center gap-4 lg:grid-cols-[52px_minmax(0,1fr)_100px_130px] lg:gap-6">
        <span className="text-sm tabular-nums text-neutral-400">
          {String(index + 1).padStart(2, "0")}
        </span>

        <div className="min-w-0">
          <h3 className="text-[15px] font-semibold leading-6 text-neutral-900 transition-colors group-hover:text-primary-700 lg:text-base">
            {publication.title}
          </h3>

          {source.length > 0 && (
            <p className="mt-1 text-sm leading-5 text-neutral-500">
              {source.join(" · ")}
            </p>
          )}
        </div>

        <div className="text-sm tabular-nums text-neutral-600">
          <span className="lg:hidden">Tahun {year ?? "—"}</span>
          <span className="hidden lg:inline">{year ?? "—"}</span>
        </div>

        <div className="lg:text-right">
          {publication.href ? (
            <a
              href={publication.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center gap-2 rounded-md px-2 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50 hover:text-primary-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
            >
              Lihat
              <i
                className="fa-solid fa-arrow-up-right-from-square text-[10px]"
                aria-hidden="true"
              />
            </a>
          ) : (
            <span className="text-sm text-neutral-400">Belum tersedia</span>
          )}
        </div>
      </div>
    </article>
  );
}

function PublicationGroup({
  category,
  publications,
}: {
  category: PublicationStatus;
  publications: Publication[];
}) {
  if (publications.length === 0) return null;

  return (
    <section
      id={getCategoryId(category)}
      className="scroll-mt-28 pt-10 lg:pt-12"
    >
      <div className="mb-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
            {CATEGORY_LABEL[category]}
          </h2>

          <span className="inline-flex min-w-6 items-center justify-center rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs font-medium tabular-nums text-neutral-500">
            {publications.length}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <div className="hidden border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 lg:grid lg:grid-cols-[52px_minmax(0,1fr)_100px_120px] lg:gap-6 lg:px-6">
          <span>No.</span>
          <span>Nama Publikasi</span>
          <span>Tahun</span>
          <span className="text-right">Detail</span>
        </div>

        {publications.map((publication, index) => (
          <PublicationItem
            key={publication.id}
            publication={publication}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}

function PublicationOverview({
  publications,
}: {
  publications: Publication[];
}) {
  const categories = CATEGORY_ORDER.filter((category) =>
    publications.some((publication) => publication.category === category),
  );

  return (
    <nav
      aria-label="Ringkasan publikasi"
      className="mb-8 overflow-hidden rounded-lg border border-neutral-200 bg-white"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-4">
        {categories.map((category, index) => (
          <a
            key={category}
            href={`#${getCategoryId(category)}`}
            className={`group flex min-h-24 items-center justify-between px-5 py-5 transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-inset lg:px-6 ${
              index > 0
                ? "border-t border-neutral-200 sm:border-l sm:border-t-0"
                : ""
            } ${index === 2 ? "sm:border-l-0 lg:border-l" : ""}`}
          >
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-500 transition-colors group-hover:text-primary-700">
                {CATEGORY_LABEL[category]}
              </span>

              <p className="mt-1.5 text-sm text-neutral-400">
                Koleksi publikasi
              </p>
            </div>

            <span className="text-2xl font-semibold tabular-nums tracking-tight text-neutral-900">
              {getCategoryCount(publications, category)}
            </span>
          </a>
        ))}
      </div>
    </nav>
  );
}

export function RecentPublications({
  publications,
}: {
  publications: Publication[];
}) {
  const [query, setQuery] = useState("");

  const filteredPublications = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return publications;

    return publications.filter((publication) =>
      [publication.title, publication.category, ...publication.meta].some(
        (value) => value.toLowerCase().includes(normalizedQuery),
      ),
    );
  }, [publications, query]);

  const groupedPublications = CATEGORY_ORDER.map((category) => ({
    category,
    publications: filteredPublications.filter(
      (publication) => publication.category === category,
    ),
  })).filter((group) => group.publications.length > 0);

  return (
    <div id="semua-publikasi">
      {publications.length === 0 ? (
        <div className="rounded-lg border border-neutral-200 bg-white px-6 py-10">
          <p className="text-sm font-semibold text-neutral-900">
            Belum ada publikasi yang diterbitkan.
          </p>

          <p className="mt-2 max-w-xl text-sm leading-6 text-neutral-500">
            Publikasi anggota PSI Cabang Surabaya akan ditampilkan di halaman
            ini setelah diterbitkan.
          </p>
        </div>
      ) : (
        <>
          <PublicationOverview publications={publications} />

          <div className="relative mb-8">
            <i
              className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-sm text-foreground-muted"
              aria-hidden="true"
            />

            <label htmlFor="publication-search" className="sr-only">
              Cari publikasi
            </label>

            <input
              id="publication-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari publikasi..."
              className="h-11 w-full rounded-md border border-neutral-300 bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {groupedPublications.length > 0 ? (
            <div>
              {groupedPublications.map((group) => (
                <PublicationGroup
                  key={group.category}
                  category={group.category}
                  publications={group.publications}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-md border-y border-neutral-200 py-10">
              <p className="text-sm font-semibold text-neutral-900">
                Publikasi tidak ditemukan.
              </p>

              <p className="mt-1 text-sm text-foreground-muted">
                Tidak ada publikasi yang sesuai dengan pencarian.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}