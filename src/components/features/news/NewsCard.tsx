
import Image from "next/image";
import Link from "next/link";
import { FaCalendarAlt } from "react-icons/fa";
import { Card } from "@/components/ui";
import type { NewsItem } from "./data";

interface NewsCardProps {
  item: NewsItem;
  priority?: boolean;
}

export function NewsCard({ item, priority = false }: NewsCardProps) {
  return (
    <Card
      padded={false}
      className="flex h-full flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-4/3 w-full bg-neutral-100">
        <Image
          src={item.image}
          alt={item.title}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary-600">
          <FaCalendarAlt className="h-3.5 w-3.5" aria-hidden="true" />
          {item.date}
        </span>

        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
          {item.title}
        </h3>

        <p className="line-clamp-3 text-sm leading-6 text-foreground-muted">
          {item.excerpt}
        </p>

        <Link
          href={item.href}
          className="mt-auto pt-2 text-sm font-semibold text-primary-600 hover:text-primary-700"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </Card>
  );
}