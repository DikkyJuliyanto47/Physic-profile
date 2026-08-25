import Link from "next/link";
import Image from "next/image";

import type { DocumentationItem } from "./data";

interface GalleryItemCardProps {
  item: DocumentationItem;
}

export function GalleryItemCard({ item }: GalleryItemCardProps) {
  return (
    <Link
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-md border border-border bg-background transition-colors duration-200 hover:border-primary-300"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-neutral-200">
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          unoptimized
          className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />

        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-sm bg-black/70 px-2 py-1 text-xs font-medium text-white">
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
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-primary-600">
              <i className="fa-solid fa-play" aria-hidden="true" />
            </span>
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-4">
        <span className="flex items-center gap-1.5 text-xs text-foreground-muted">
          <i className="fa-regular fa-calendar" aria-hidden="true" />
          {item.date}
        </span>

        <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-foreground">
          {item.title}
        </h3>

        {item.description && (
          <p className="line-clamp-2 text-xs leading-5 text-foreground-muted">
            {item.description}
          </p>
        )}

        <span className="mt-1 flex items-center gap-1.5 text-xs text-foreground-muted">
          <i className="fa-solid fa-location-dot" aria-hidden="true" />
          {item.location}
        </span>
      </div>
    </Link>
  );
}