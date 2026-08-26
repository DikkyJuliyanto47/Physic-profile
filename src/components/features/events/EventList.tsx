import type { EventItem } from "./data";
import { EventCard } from "./EventCard";

interface EventListProps {
  items: EventItem[];
}

export function EventList({ items }: EventListProps) {
  if (items.length === 0) {
    return (
      <div className="border-y border-border py-12 text-center">
        <p className="text-sm text-foreground-muted">
          Belum ada agenda yang tersedia.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {items.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}