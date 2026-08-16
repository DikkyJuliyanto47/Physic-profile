/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 13:00:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 13:00:00
 */

import Link from "next/link";

const CATEGORIES = ["Seminar", "Rapat", "Kegiatan Sosial"];

export function CategoryWidget() {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
        Kategori
      </h3>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/news?kategori=${encodeURIComponent(category.toLowerCase())}`}
            className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-primary-700"
          >
            {category}
          </Link>
        ))}
      </div>
    </div>
  );
}
