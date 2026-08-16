import Link from "next/link";

import { Card } from "@/components/ui";

import type { ContentSummaryItem } from "./types";

interface ContentSummaryGridProps {
  items: ContentSummaryItem[];
}

export function ContentSummaryGrid({ items }: ContentSummaryGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {items.map((item) => (
        <Link key={item.label} href={item.href} className="block">
          <Card className="transition-colors hover:border-primary-300">
            <p className="text-sm font-medium text-foreground-muted">
              {item.label}
            </p>
            <p className="mt-2 text-3xl font-bold text-foreground">
              {item.count}
            </p>
          </Card>
        </Link>
      ))}
    </div>
  );
}
