"use client";

import { useMemo, useState } from "react";
import { GalleryItemCard } from "./GalleryItemCard";
import type { DocumentationItem, DocumentationType } from "./data";

type FilterValue = "all" | DocumentationType;

const FILTERS: { value: FilterValue; label: string; icon: string }[] = [
  { value: "all", label: "Semua", icon: "fa-solid fa-list" },
  { value: "photo", label: "Foto", icon: "fa-regular fa-folder-open" },
  { value: "video", label: "Video", icon: "fa-solid fa-play" },
];

interface DocumentationGridProps {
  items: DocumentationItem[];
}

export function DocumentationGrid({ items }: DocumentationGridProps) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query, setQuery] = useState("");

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return items.filter((item) => {
      const matchesFilter = filter === "all" || item.type === filter;
      const matchesQuery =
        !normalizedQuery ||
        [item.title, item.location]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);

      return matchesFilter && matchesQuery;
    });
  }, [items, filter, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2.5">
        <i
          className="fa-solid fa-magnifying-glass text-foreground-muted"
          aria-hidden="true"
        />
        <label htmlFor="gallery-search" className="sr-only">
          Cari dokumentasi
        </label>
        <input
          id="gallery-search"
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Cari Judul....."
          className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted"
        />
      </div>

      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filter tipe dokumentasi"
      >
        {FILTERS.map((item) => {
          const isActive = filter === item.value;
          return (
            <button
              key={item.value}
              type="button"
              onClick={() => setFilter(item.value)}
              aria-pressed={isActive}
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "border-primary-200 bg-primary-100 text-primary-700"
                  : "border-border bg-background text-foreground-muted hover:bg-background-muted"
              }`}
            >
              <i className={item.icon} aria-hidden="true" />
              {item.label}
            </button>
          );
        })}
      </div>

      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {filteredItems.map((item) => (
            <GalleryItemCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-foreground-muted">
          Tidak ada dokumentasi yang cocok dengan pencarian.
        </p>
      )}
    </div>
  );
}