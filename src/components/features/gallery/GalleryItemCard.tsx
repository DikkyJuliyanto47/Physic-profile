/*
 * @Author: galhkoernia
 * @Date: 2026-08-09 09:47:25
 * @Last Modified by: galhkoernia
 */

import Image from "next/image";
import Link from "next/link";
import type { DocumentationItem } from "./data";

interface GalleryItemCardProps {
  item: DocumentationItem;
}

export function GalleryItemCard({ item }: GalleryItemCardProps) {
  return (
    <Link
      href={item.href}
      className="
        group flex flex-col gap-3 rounded-md
        border border-border bg-background p-3
        transition-colors duration-200
        hover:border-primary-300
      "
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-neutral-200">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <span className="absolute left-2 top-2 flex items-center gap-1.5 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
          <i
            className={
              item.type === "video"
                ? "fa-solid fa-video"
                : "fa-regular fa-image"
            }
            aria-hidden="true"
          />
          {item.countLabel}
        </span>

        {item.type === "video" && (
          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-sm">
              <i className="fa-solid fa-play" aria-hidden="true" />
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <i className="fa-regular fa-calendar" aria-hidden="true" />
          {item.date}
        </span>

        <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
          {item.title}
        </h3>

        <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
          {item.location}
        </span>
      </div>
    </Link>
  );
}