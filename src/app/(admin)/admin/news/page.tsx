import Link from "next/link";

import { prisma } from "@/lib/prisma";
import { ContentStatus, NewsCategory } from "@/generated/prisma/client";

import { NewsActions } from "./NewsActions";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<NewsCategory, string> = {
  ORGANISASI: "Organisasi",
  SEMINAR: "Seminar",
  WORKSHOP: "Workshop",
  PERTEMUAN_RUTIN: "Pertemuan Rutin",
  KERJASAMA: "Kerjasama",
  PRESTASI_ANGGOTA: "Prestasi Anggota",
};

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  ORGANISASI: "bg-blue-50 text-blue-700",
  SEMINAR: "bg-violet-50 text-violet-700",
  WORKSHOP: "bg-orange-50 text-orange-700",
  PERTEMUAN_RUTIN: "bg-teal-50 text-teal-700",
  KERJASAMA: "bg-indigo-50 text-indigo-700",
  PRESTASI_ANGGOTA: "bg-amber-50 text-amber-700",
};

function formatDate(date: Date | null): string {
  if (!date) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function getStatusStyles(status: ContentStatus): string {
  switch (status) {
    case "PUBLISHED":
      return "bg-emerald-50 text-emerald-700";
    case "DRAFT":
      return "bg-amber-50 text-amber-700";
    case "ARCHIVED":
      return "bg-neutral-100 text-neutral-600";
  }
}

function getStatusLabel(status: ContentStatus): string {
  switch (status) {
    case "PUBLISHED":
      return "Terbit";
    case "DRAFT":
      return "Draf";
    case "ARCHIVED":
      return "Arsip";
  }
}

export default async function NewsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    where.status = status as ContentStatus;
  }

  const newsList = await prisma.news.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  const hasFilter = Boolean(q || status);

  return (
    <div className="w-full min-w-0 space-y-6 sm:space-y-8">
      <header className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Berita & Pengumuman
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
            Kelola berita dan pengumuman PSI Surabaya.
          </p>
        </div>

        <Link
          href="/admin/news/new"
          className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 sm:w-auto"
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
          Tambah Berita Baru
        </Link>
      </header>

      <form
        method="GET"
        className="flex min-w-0 flex-col gap-2.5 sm:flex-row sm:items-center"
      >
        <div className="relative min-w-0 flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.75}
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
            placeholder="Cari judul atau slug..."
            className="h-10 w-full rounded-md border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
        </div>

        <select
          name="status"
          defaultValue={status ?? ""}
          className="h-10 w-full rounded-md border border-neutral-200 bg-white px-3.5 text-sm text-neutral-700 outline-none transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500 sm:w-40"
        >
          <option value="">Semua Status</option>
          <option value="DRAFT">Draf</option>
          <option value="PUBLISHED">Terbit</option>
          <option value="ARCHIVED">Arsip</option>
        </select>

        <button
          type="submit"
          className="h-10 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
        >
          Filter
        </button>

        {hasFilter && (
          <Link
            href="/admin/news"
            className="inline-flex h-10 items-center justify-center rounded-md px-3 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          >
            Reset
          </Link>
        )}
      </form>

      <section className="min-w-0 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
        <div className="flex min-h-14 items-center justify-between border-b border-neutral-100 px-4 sm:px-5">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 sm:text-base">
              Daftar Berita
            </h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {newsList.length} berita ditampilkan
            </p>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-190 text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/70">
                <th className="px-4 py-3 font-medium text-neutral-500 sm:px-5">
                  Judul
                </th>
                <th className="w-32 px-4 py-3 font-medium text-neutral-500 sm:px-5">
                  Status
                </th>
                <th className="w-40 px-4 py-3 font-medium text-neutral-500 sm:px-5">
                  Penulis
                </th>
                <th className="w-36 px-4 py-3 font-medium text-neutral-500 sm:px-5">
                  Tanggal
                </th>
                <th className="w-36 px-4 py-3 text-right font-medium text-neutral-500 sm:px-5">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {newsList.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-16 text-center text-sm text-neutral-500"
                  >
                    <div className="mx-auto max-w-sm">
                      <p className="font-medium text-neutral-700">
                        {hasFilter
                          ? "Tidak ada berita yang cocok."
                          : "Belum ada berita."}
                      </p>
                      <p className="mt-1 text-neutral-500">
                        {hasFilter
                          ? "Coba ubah kata kunci atau filter yang digunakan."
                          : "Berita yang dibuat akan muncul di sini."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                newsList.map((news) => (
                  <tr
                    key={news.id}
                    className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60"
                  >
                    <td className="px-4 py-4 sm:px-5">
                      <div className="min-w-0">
                        <p className="line-clamp-1 font-medium text-neutral-900">
                          {news.title}
                        </p>

                        <span
                          className={`mt-1.5 inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium ${CATEGORY_COLORS[news.category]}`}
                        >
                          {CATEGORY_LABELS[news.category]}
                        </span>
                      </div>
                    </td>

                    <td className="px-4 py-4 sm:px-5">
                      <span
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusStyles(news.status)}`}
                      >
                        {getStatusLabel(news.status)}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-neutral-600 sm:px-5">
                      <span className="line-clamp-1">{news.author.name}</span>
                    </td>

                    <td className="px-4 py-4 text-neutral-600 sm:px-5">
                      {formatDate(news.publishedAt ?? news.createdAt)}
                    </td>

                    <td className="px-4 py-4 text-right sm:px-5">
                      <NewsActions
                        newsId={news.id}
                        newsTitle={news.title}
                        currentStatus={news.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}