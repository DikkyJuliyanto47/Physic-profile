
import { NewsCard } from "./NewsCard";
import type { NewsItem } from "./data";

interface NewsGridProps {
  items: NewsItem[];
}

export function NewsGrid({ items }: NewsGridProps) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-background-muted p-8 text-center text-sm text-foreground-muted">
        Belum ada berita yang tersedia saat ini.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((item, index) => (
        <NewsCard key={item.id} item={item} priority={index === 0} />
      ))}
    </div>
  );
}