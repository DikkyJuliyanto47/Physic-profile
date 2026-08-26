import Image from "next/image";
import Link from "next/link";

import type { EventItem } from "./data";
import { EventDate } from "./EventDate";
import { EventMeta } from "./EventMeta";

interface EventCardProps {
  event: EventItem;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <article className="group border-b border-border py-7 first:pt-0 sm:py-8">
      <Link
        href={event.href}
        className="grid gap-6 sm:grid-cols-[80px_minmax(180px,320px)_minmax(0,1fr)] sm:gap-7 lg:grid-cols-[92px_300px_minmax(0,1fr)] lg:gap-8"
      >
        <EventDate date={event.date} />

        {event.image ? (
          <div className="relative aspect-16/10 overflow-hidden rounded-md bg-background-muted">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 640px) 100vw, 320px"
            />
          </div>
        ) : (
          <div className="aspect-16/10 rounded-md bg-background-muted" />
        )}

        <div className="min-w-0">
          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary-600">
            Agenda
          </span>

          <h2 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-primary-950 transition-colors group-hover:text-primary-600 sm:text-[22px]">
            {event.title}
          </h2>

          <EventMeta
            time={event.time}
            location={event.location}
            className="mt-4"
          />

          <p className="mt-4 line-clamp-2 max-w-2xl text-sm leading-6 text-foreground-muted">
            {event.description}
          </p>

          <span className="mt-4 inline-flex border-b border-primary-900/30 pb-0.5 text-sm font-semibold text-primary-900 transition-colors group-hover:border-primary-600 group-hover:text-primary-600">
            Lihat Detail →
          </span>
        </div>
      </Link>
    </article>
  );
}