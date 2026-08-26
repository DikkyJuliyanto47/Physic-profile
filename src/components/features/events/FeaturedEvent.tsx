import Image from "next/image";
import Link from "next/link";

import type { EventItem } from "./data";
import { EventDate } from "./EventDate";
import { EventMeta } from "./EventMeta";

interface FeaturedEventProps {
  item: EventItem;
}

export function FeaturedEvent({ item }: FeaturedEventProps) {
  return (
    <Link
      href={item.href}
      className="group grid gap-7 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10"
    >
      {item.image ? (
        <div className="relative min-h-65 overflow-hidden rounded-md bg-background-muted lg:min-h-90">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
        </div>
      ) : (
        <div className="min-h-65 rounded-md bg-background-muted lg:min-h-90" />
      )}

      <div className="flex flex-col justify-between py-1 lg:py-2">
        <div>
          <div className="flex items-start gap-5">
            <EventDate date={item.date} />

            <span className="pt-1 text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
              Agenda Mendatang
            </span>
          </div>

          <h2 className="mt-7 text-2xl font-semibold leading-tight tracking-tight text-primary-950 transition-colors group-hover:text-primary-600 sm:text-3xl">
            {item.title}
          </h2>

          <EventMeta
            time={item.time}
            location={item.location}
            className="mt-5"
          />

          <p className="mt-5 line-clamp-4 text-sm leading-6 text-foreground-muted">
            {item.description}
          </p>
        </div>

        <span className="mt-8 inline-flex w-fit border-b border-primary-900/30 pb-0.5 text-sm font-semibold text-primary-900 transition-colors group-hover:border-primary-600 group-hover:text-primary-600">
          Lihat Detail →
        </span>
      </div>
    </Link>
  );
}