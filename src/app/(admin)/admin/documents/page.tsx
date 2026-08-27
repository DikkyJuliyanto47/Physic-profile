import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DocumentActions } from "./DocumentActions";

export const dynamic = "force-dynamic";

const CATEGORY_COLORS: Record<string, string> = {
  Kurikulum: "bg-blue-50 text-blue-700",
  Akreditasi: "bg-purple-50 text-purple-700",
  Panduan: "bg-teal-50 text-teal-700",
  Template: "bg-orange-50 text-orange-700",
  Regulasi: "bg-red-50 text-red-700",
  Lainnya: "bg-neutral-100 text-neutral-600",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default async function DocumentsListPage({
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

  const documents = await prisma.documentResource.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: {
      uploader: { select: { name: true } },
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Sumber Daya & Dokumen
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola dokumen akademik dan sumber daya Physical Society of Indonesia Cabang Surabaya.
          </p>
        </div>
        <Link
          href="/admin/documents/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tambah Dokumen Baru
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Cari judul atau deskripsi..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          name="category"
          defaultValue={category ?? ""}
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="">Semua Kategori</option>
          <option value="Kurikulum">Kurikulum</option>
          <option value="Akreditasi">Akreditasi</option>
          <option value="Panduan">Panduan</option>
          <option value="Template">Form / Template</option>
          <option value="Regulasi">Regulasi</option>
          <option value="Lainnya">Lainnya</option>
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
                <th className="px-5 py-3 font-medium text-neutral-600">Dokumen</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Kategori</th>
                <th className="px-5 py-3 font-medium text-neutral-600">File</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Visibilitas</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Tanggal</th>
                <th className="px-5 py-3 text-right font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-500">
                    {q || category
                      ? "Tidak ada dokumen yang cocok dengan filter."
                      : "Belum ada dokumen."}
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-neutral-900 line-clamp-1">
                          {doc.title}
                        </p>
                        {doc.description && (
                          <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                            {doc.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[doc.category] ?? CATEGORY_COLORS.Lainnya}`}
                      >
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        {doc.fileType && (
                          <span className="inline-flex items-center rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-700">
                            {doc.fileType}
                          </span>
                        )}
                        {doc.fileSize && (
                          <span className="text-xs text-neutral-500">
                            {doc.fileSize}
                          </span>
                        )}
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          Lihat
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          doc.isPublic
                            ? "bg-green-50 text-green-700"
                            : "bg-yellow-50 text-yellow-700"
                        }`}
                      >
                        {doc.isPublic ? "Publik" : "Internal"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-sm text-neutral-600">
                          {formatDate(doc.createdAt)}
                        </p>
                        {doc.uploader && (
                          <p className="text-xs text-neutral-500">
                            {doc.uploader.name}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <DocumentActions
                        docId={doc.id}
                        docTitle={doc.title}
                        isPublic={doc.isPublic}
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
