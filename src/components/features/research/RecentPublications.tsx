"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, FileText, Search } from "lucide-react";
import type { Publication, PublicationStatus } from "./types";

const CATEGORIES: { category: PublicationStatus; label: string }[] = [
  { category: "JURNAL", label: "Jurnal" },
  { category: "PROSIDING", label: "Prosiding" },
  { category: "BUKU", label: "Buku" },
  { category: "HKI", label: "HKI" },
];

function categoryFromHash(hash: string) {
  return CATEGORIES.find(({ category }) => `#${category.toLowerCase()}` === hash)?.category ?? null;
}

function PublicationItem({
  publication,
  label,
}: {
  publication: Publication;
  label: string;
}) {
  const lastMetadata = publication.meta.at(-1);
  const year = lastMetadata && /^\d{4}$/.test(lastMetadata.trim())
    ? lastMetadata
    : undefined;
  const metadata = (year ? publication.meta.slice(0, -1) : publication.meta)
    .filter((value) => value.trim());

  const content = (
    <>
      <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-primary-50 text-primary-700">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="wrap-anywhere text-base font-semibold leading-6 text-primary-900 group-hover:text-primary-700">
          {publication.title}
        </h3>
        <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs leading-5 text-foreground-muted">
          <span className="font-medium text-primary-700">{label}</span>
          {year && <span>Tahun {year}</span>}
        </p>
        {metadata.length > 0 && (
          <p className="mt-1.5 wrap-anywhere text-sm leading-6 text-foreground-muted">
            {metadata.join(" · ")}
          </p>
        )}
      </div>
      {publication.href && (
        <span className="inline-flex shrink-0 items-center gap-1.5 self-start pt-1 text-xs font-medium text-primary-700">
          <span className="hidden sm:inline">Lihat publikasi</span>
          <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          <span className="sr-only"> (dibuka di tab baru)</span>
        </span>
      )}
    </>
  );

  const rowClassName = "flex min-w-0 items-start gap-3 px-2 py-4 sm:gap-4 sm:px-3";

  return (
    <li className="min-w-0 border-b border-neutral-200 last:border-b-0">
      <article>
        {publication.href ? (
          <a
            href={publication.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`group ${rowClassName} rounded-sm transition-colors duration-150 hover:bg-primary-50/50 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none`}
          >
            {content}
          </a>
        ) : (
          <div className={rowClassName}>{content}</div>
        )}
      </article>
    </li>
  );
}

export function RecentPublications({ publications }: { publications: Publication[] }) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PublicationStatus | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncHash = () => setActiveCategory(categoryFromHash(window.location.hash));
    // SectionNav uses replaceState, which does not emit a hashchange event.
    const handleCategoryClick = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("aside nav a[href]");
      const layout = rootRef.current?.closest("main")?.parentElement;
      if (!anchor || !layout?.contains(anchor)) return;
      const href = anchor.getAttribute("href") ?? "";
      if (href === "#semua-publikasi" || categoryFromHash(href)) {
        setActiveCategory(categoryFromHash(href));
        // Align the existing anchor after the filtered content has rendered.
        window.requestAnimationFrame(() => {
          if (rootRef.current?.isConnected) {
            document.getElementById(href.slice(1))?.scrollIntoView({ block: "start" });
          }
        });
      }
    };

    syncHash();
    document.addEventListener("click", handleCategoryClick);
    window.addEventListener("hashchange", syncHash);
    window.addEventListener("popstate", syncHash);
    return () => {
      document.removeEventListener("click", handleCategoryClick);
      window.removeEventListener("hashchange", syncHash);
      window.removeEventListener("popstate", syncHash);
    };
  }, []);

  const keyword = query.trim().toLowerCase();
  const categoryPublications = activeCategory
    ? publications.filter((publication) => publication.category === activeCategory)
    : publications;
  const filteredPublications = categoryPublications.filter((publication) =>
    publication.title.toLowerCase().includes(keyword),
  );
  const activeLabel = CATEGORIES.find(({ category }) => category === activeCategory)?.label;
  const groups = CATEGORIES
    .filter(({ category }) => !activeCategory || category === activeCategory)
    .map(({ category, label }) => ({
      category,
      label,
      items: filteredPublications.filter((publication) => publication.category === category),
    }))
    .filter(({ items }) => items.length > 0);

  return (
    <div ref={rootRef}>
      <section id="semua-publikasi" aria-labelledby="publication-introduction" className="scroll-mt-28 border-b border-neutral-200 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
          <div className="min-w-0 max-w-xl">
            <h2 id="publication-introduction" className="text-xl font-semibold leading-7 tracking-tight text-primary-900">
              Eksplorasi Publikasi
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              Telusuri karya ilmiah PSI Cabang Surabaya melalui koleksi jurnal,
              prosiding, buku, dan hak kekayaan intelektual.
            </p>
          </div>
          <p className="flex shrink-0 items-baseline gap-2 border-l-2 border-primary-200 pl-3 sm:block">
            <span className="text-2xl font-semibold tabular-nums tracking-tight text-primary-900">{categoryPublications.length}</span>
            <span className="text-xs leading-5 text-foreground-muted sm:block">
              {activeLabel ? `publikasi ${activeLabel}` : "publikasi dalam koleksi"}
            </span>
          </p>
        </div>
        {publications.length > 0 && (
          <div className="mt-4 max-w-xl">
            <label htmlFor="publication-search" className="mb-1.5 block text-xs font-medium text-primary-900">
              Cari judul publikasi
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
              <input
                id="publication-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Masukkan judul atau kata kunci..."
                aria-describedby="publication-search-status"
                className="h-11 w-full rounded-md border border-neutral-300 bg-background pl-10 pr-3 text-sm text-foreground transition-colors duration-150 hover:border-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none"
              />
            </div>
          </div>
        )}
        <p id="publication-search-status" role="status" className="mt-2 text-xs leading-5 text-foreground-muted">
          {keyword
            ? `${filteredPublications.length} hasil pencarian untuk “${query.trim()}”${activeLabel ? ` dalam kategori ${activeLabel}` : ""}.`
            : "Pencarian berdasarkan judul pada koleksi yang dimuat di halaman ini."}
        </p>
      </section>

      <div className="pt-5">
        {CATEGORIES.map(({ category, label }) => {
          const group = groups.find((item) => item.category === category);
          // Keep anchor nodes mounted for the existing sidebar observer.
          return (
            <section
              key={category}
              id={category.toLowerCase()}
              aria-hidden={!group || undefined}
              aria-labelledby={group ? `${category.toLowerCase()}-heading` : undefined}
              className={group ? "scroll-mt-28 pb-5 last:pb-0" : "scroll-mt-28"}
            >
              {group && (
                <>
                  <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                    <h2 id={`${category.toLowerCase()}-heading`} className="text-base font-semibold text-primary-900">{label}</h2>
                    {!activeCategory && <span className="text-xs tabular-nums text-foreground-muted">{group.items.length} publikasi</span>}
                  </div>
                  <ul className="border-y border-neutral-200">
                    {group.items.map((publication) => (
                      <PublicationItem key={publication.id} publication={publication} label={label} />
                    ))}
                  </ul>
                </>
              )}
            </section>
          );
        })}
        {groups.length === 0 && (
          <div className="py-5">
            <h2 className="text-base font-semibold text-primary-900">
              {keyword ? "Publikasi tidak ditemukan" : activeLabel ?? "Koleksi publikasi"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-foreground-muted">
              {keyword
                ? "Tidak ada judul yang cocok. Coba kata kunci lain atau kosongkan pencarian."
                : activeLabel
                  ? `Belum ada publikasi dalam kategori ${activeLabel}.`
                  : "Belum ada publikasi yang tersedia dalam koleksi ini."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
