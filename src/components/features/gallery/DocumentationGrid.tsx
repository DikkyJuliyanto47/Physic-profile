"use client";

import { useMemo, useState } from "react";

import { GalleryItemCard } from "./GalleryItemCard";

import type { DocumentationItem, DocumentationType } from "./data";

type FilterValue = "all" | DocumentationType;

export function DocumentationGrid({ items }: { items: DocumentationItem[] }) {
  const [filter, setFilter] = useState<FilterValue>("all");
  const [query] = useState("");

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

  const photoItems = filteredItems.filter((item) => item.type === "photo");
  const videoItems = filteredItems.filter((item) => item.type === "video");

  const renderItems = (items: DocumentationItem[]) =>
    items.length > 0 ? (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {items.map((item) => (
          <GalleryItemCard key={item.id} item={item} />
        ))}
      </div>
    ) : (
      <p className="py-8 text-sm text-foreground-muted">
        Tidak ada dokumentasi yang cocok.
      </p>
    );

  return (
    <div>
      <div id="semua" className="scroll-mt-28">

        <div className="hidden">
          <button type="button" onClick={() => setFilter("all")}>
            Semua
          </button>
          <button type="button" onClick={() => setFilter("photo")}>
            Foto
          </button>
          <button type="button" onClick={() => setFilter("video")}>
            Video
          </button>
        </div>

        {filteredItems.length > 0 ? (
          <div className="space-y-12">
            <section id="foto" className="scroll-mt-28">
              {photoItems.length > 0 && (
                <>
                  <div className="mb-5 border-b border-neutral-200 pb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
                      Foto
                    </h2>
                  </div>

                  {renderItems(photoItems)}
                </>
              )}
            </section>

            <section id="video" className="scroll-mt-28">
              {videoItems.length > 0 && (
                <>
                  <div className="mb-5 border-b border-neutral-200 pb-3">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
                      Video
                    </h2>
                  </div>

                  {renderItems(videoItems)}
                </>
              )}
            </section>
          </div>
        ) : (
          <p className="py-8 text-sm text-foreground-muted">
            Tidak ada dokumentasi yang cocok dengan pencarian.
          </p>
        )}
      </div>
    </div>
  );
}