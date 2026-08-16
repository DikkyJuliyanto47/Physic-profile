import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PublicationType } from "@/generated/prisma/client";
import { PublicationActions } from "./PublicationActions";

export const dynamic = "force-dynamic";

const TYPE_LABELS: Record<PublicationType, string> = {
  JURNAL: "Jurnal",
  BUKU: "Buku",
  HKI: "HKI",
  PROSIDING: "Prosiding",
};

const TYPE_COLORS: Record<PublicationType, string> = {
  JURNAL: "bg-blue-50 text-blue-700",
  BUKU: "bg-purple-50 text-purple-700",
  HKI: "bg-amber-50 text-amber-700",
  PROSIDING: "bg-teal-50 text-teal-700",
};

function formatDate(date: Date | null): string {
  if (!date) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function PublicationListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { description: { contains: q, mode: "insensitive" } },
    ];
  }

  if (type && ["JURNAL", "BUKU", "HKI", "PROSIDING"].includes(type)) {
    where.type = type as PublicationType;
  }

  const publications = await prisma.publication.findMany({
    where,
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Publikasi</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola publikasi, jurnal, buku, dan HKI PSI Surabaya.
          </p>
        </div>
        <Link
          href="/admin/publication/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
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
          Tambah Publikasi Baru
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
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
            placeholder="Cari judul atau deskripsi..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          name="type"
          defaultValue={type ?? ""}
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="">Semua Tipe</option>
          <option value="JURNAL">Jurnal</option>
          <option value="BUKU">Buku</option>
          <option value="HKI">HKI</option>
          <option value="PROSIDING">Prosiding</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-600">
                  Judul
                </th>
                <th className="px-5 py-3 font-medium text-neutral-600">Tipe</th>
                <th className="px-5 py-3 font-medium text-neutral-600">
                  Tanggal
                </th>
                <th className="px-5 py-3 text-right font-medium text-neutral-600">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {publications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center text-neutral-500">
                    {q || type
                      ? "Tidak ada publikasi yang cocok dengan filter."
                      : "Belum ada publikasi."}
                  </td>
                </tr>
              ) : (
                publications.map((pub) => (
                  <tr
                    key={pub.id}
                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-neutral-900 line-clamp-1">
                          {pub.title}
                        </p>
                        {pub.description && (
                          <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                            {pub.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[pub.type]}`}
                      >
                        {TYPE_LABELS[pub.type]}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      {formatDate(pub.publishedAt ?? pub.createdAt)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <PublicationActions
                        publicationId={pub.id}
                        publicationTitle={pub.title}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
