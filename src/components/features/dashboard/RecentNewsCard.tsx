import Link from "next/link";

import { Badge, Card } from "@/components/ui";

import type { ContentStatus, RecentNewsItem } from "./dummy-data";

interface RecentNewsCardProps {
  items: RecentNewsItem[];
}

const statusTone: Record<ContentStatus, "primary" | "neutral" | "dark"> = {
  DRAFT: "neutral",
  PUBLISHED: "primary",
  ARCHIVED: "dark",
};

const statusLabel: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export function RecentNewsCard({ items }: RecentNewsCardProps) {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Berita Terbaru
        </h2>
        <Link
          href="/admin/berita"
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
                {item.category.replaceAll("_", " ")} &middot; {item.createdAt}
              </p>
            </div>
            <Badge tone={statusTone[item.status]} className="w-fit shrink-0">
              {statusLabel[item.status]}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}