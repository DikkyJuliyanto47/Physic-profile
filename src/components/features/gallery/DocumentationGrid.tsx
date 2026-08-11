/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 09:48:00 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-09 10:35:12
 */

"use client";

import { useMemo, useState } from "react";
import { Container, Section } from "@/components/ui";
import { GalleryItemCard } from "./GalleryItemCard";
import type { DocumentationItem, DocumentationType } from "./data";

type FilterValue = "all" | DocumentationType;

const FILTERS: { value: FilterValue; label: string; icon: string }[] = [
  { value: "all", label: "Semua", icon: "fa-solid fa-grip" },
  { value: "photo", label: "Foto", icon: "fa-regular fa-image" },
  { value: "video", label: "Video", icon: "fa-solid fa-circle-play" },
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
    <Section>
      <Container className="flex flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2" role="group" aria-label="Filter tipe dokumentasi">
            {FILTERS.map((item) => {
              const isActive = filter === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setFilter(item.value)}
                  aria-pressed={isActive}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-600 text-white"
                      : "border border-border text-foreground-muted hover:bg-background-muted"
                  }`}
                >
                  <i className={item.icon} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 lg:w-80">
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
              placeholder="Cari kegiatan, acara, atau kata kunci..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-foreground-muted"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-base font-semibold text-foreground">
            Dokumentasi Terbaru
          </span>
          <span className="text-sm font-semibold text-primary-600">
            Lihat semua
          </span>
        </div>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <GalleryItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-foreground-muted">
            Tidak ada dokumentasi yang cocok dengan pencarian.
          </p>
        )}
      </Container>
    </Section>
  );
}
