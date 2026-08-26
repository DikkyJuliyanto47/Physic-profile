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
    <article className="group border-b border-border py-7 first:pt-0">
      <Link href={event.href} className="grid gap-5 sm:grid-cols-[72px_minmax(0,1fr)]">
        <EventDate date={event.date} />

        <div className="min-w-0">
          {event.image && (
            <div className="relative mb-5 aspect-16/8 overflow-hidden border border-border bg-background-muted">
              <Image
                src={event.image}
                alt={event.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                sizes="(max-width: 640px) 100vw, 640px"
              />
            </div>
          )}

          <h2 className="text-xl font-semibold leading-tight tracking-tight text-primary-950 transition-colors group-hover:text-primary-600">
            {event.title}
          </h2>

          <EventMeta
            time={event.time}
            location={event.location}
            className="mt-3"
          />

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-foreground-muted">
            {event.description}
          </p>

          <span className="mt-5 inline-flex text-sm font-semibold text-primary-900 transition-colors group-hover:text-primary-600">
            Lihat Detail →
          </span>
        </div>
      </Link>
    </article>
  );
}