import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { GalleryActions } from "./GalleryActions";

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getYouTubeThumbnail(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  return match
    ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
    : null;
}

export default async function GalleryListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (category) {
    where.category = category;
  }

  const [items, categories] = await Promise.all([
    prisma.gallery.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    prisma.gallery.findMany({
      select: { category: true },
      distinct: ["category"],
      where: { category: { not: null } },
      orderBy: { category: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Galeri
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola foto dan video dokumentasi Physical Society of Indonesia Cabang Surabaya.
          </p>
        </div>

        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Tambah Foto / Video
        </Link>
      </div>

      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Cari judul atau caption..."
            className="w-full rounded-md border border-neutral-300 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-md border border-neutral-300 bg-white px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        >
          <option value="">Semua Kategori</option>
          {categories.map((item) => (
            <option key={item.category} value={item.category!}>
              {item.category}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="rounded-md border border-neutral-200 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300 hover:bg-neutral-50"
        >
          Filter
        </button>
      </form>

      {items.length === 0 ? (
        <div className="rounded-md border border-neutral-200 bg-white px-6 py-16 text-center">
          <svg
            className="mx-auto h-10 w-10 text-neutral-300"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z"
            />
          </svg>

          <p className="mt-4 text-sm text-neutral-500">
            {q || category
              ? "Tidak ada media yang cocok dengan filter."
              : "Belum ada media di galeri."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => {
            const thumbnail =
              item.mediaType === "VIDEO"
                ? getYouTubeThumbnail(item.mediaUrl)
                : item.mediaUrl;

            return (
              <article key={item.id} className="group min-w-0">
                <div className="overflow-hidden rounded-md border border-neutral-200 bg-white transition-shadow hover:shadow-card">
                  <div className="relative aspect-4/3 overflow-hidden bg-neutral-100">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        unoptimized
                        className="object-cover transition-transform duration-300 group-hover:scale-[1.025]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-neutral-400">
                        Foto kegiatan
                      </div>
                    )}

                    <div className="absolute left-2 top-2">
                      <span className="rounded-md bg-white/95 px-2 py-1 text-[10px] font-semibold tracking-wide text-neutral-700">
                        {item.mediaType === "VIDEO" ? "VIDEO" : "FOTO"}
                      </span>
                    </div>

                    {item.isFeatured && (
                      <div className="absolute right-2 top-2">
                        <span className="rounded-md bg-primary-600 px-2 py-1 text-[10px] font-semibold tracking-wide text-white">
                          FEATURED
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-x-0 bottom-0 flex justify-end bg-linear-to-t from-black/55 to-transparent px-2 pb-2 pt-8 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                      <GalleryActions
                        itemId={item.id}
                        itemTitle={item.title}
                        mediaType={item.mediaType}
                        mediaUrl={item.mediaUrl}
                      />
                    </div>
                  </div>

                  <div className="p-3.5">
                    <h2 className="truncate text-sm font-semibold text-neutral-900">
                      {item.title}
                    </h2>

                    <div className="mt-1.5 flex items-center gap-2 text-xs">
                      {item.category && (
                        <span className="truncate font-medium text-primary-700">
                          {item.category}
                        </span>
                      )}

                      {item.category && (
                        <span className="text-neutral-300">•</span>
                      )}

                      <time className="shrink-0 text-neutral-400">
                        {formatDate(item.createdAt)}
                      </time>
                    </div>

                    {item.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-neutral-500">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}