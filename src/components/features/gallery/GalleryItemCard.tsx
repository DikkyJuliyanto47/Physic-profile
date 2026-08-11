/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 09:47:25 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-09 09:47:25 
 */

import Link from "next/link";
import type { DocumentationItem } from "./data";

interface GalleryItemCardProps {
  item: DocumentationItem;
}

export function GalleryItemCard({ item }: GalleryItemCardProps) {
  return (
    <Link
      href={item.href}
      className="flex flex-col gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary-300"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-neutral-200">
        <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-md bg-foreground/70 px-2 py-1 text-xs font-medium text-white">
          <i
            className={
              item.type === "video" ? "fa-solid fa-video" : "fa-regular fa-image"
            }
            aria-hidden="true"
          />
          {item.countLabel}
        </span>
        {item.type === "video" ? (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary-600">
              <i className="fa-solid fa-play" aria-hidden="true" />
            </span>
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <i className="fa-regular fa-calendar" aria-hidden="true" />
          {item.date}
        </span>
        <span className="text-sm font-semibold text-foreground">
          {item.title}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
          {item.location}
        </span>
      </div>
    </Link>
  );
}
