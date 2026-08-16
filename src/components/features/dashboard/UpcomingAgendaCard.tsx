import Link from "next/link";

import { Card } from "@/components/ui";

import type { UpcomingAgendaItem } from "./types";

interface UpcomingAgendaCardProps {
  items: UpcomingAgendaItem[];
}

export function UpcomingAgendaCard({ items }: UpcomingAgendaCardProps) {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Agenda Mendatang
        </h2>
        <Link
          href="/admin/agenda"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex flex-col gap-2 border-b border-border px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {item.title}
              </p>
              <p className="mt-1 text-xs text-foreground-muted">
                {item.category.replaceAll("_", " ")} &middot; {item.location}
              </p>
            </div>
            <span className="shrink-0 text-sm font-medium text-foreground">
              {item.startDate}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
