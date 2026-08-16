import Link from "next/link";

import { Card } from "@/components/ui";

import type { RecentMessageItem } from "./types";

interface RecentMessagesCardProps {
  items: RecentMessageItem[];
  unreadCount: number;
}

export function RecentMessagesCard({
  items,
  unreadCount,
}: RecentMessagesCardProps) {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Pesan Masuk
          </h2>
          <p className="mt-1 text-sm text-foreground-muted">
            {unreadCount} pesan belum dibaca
          </p>
        </div>
        <Link
          href="/admin/pesan"
          className="text-sm font-medium text-primary-600 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      <ul>
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {item.name}
              </p>
              <p className="truncate text-xs text-foreground-muted">
                {item.subject}
              </p>
            </div>
            <span className="shrink-0 text-xs text-foreground-muted">
              {item.createdAt}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
