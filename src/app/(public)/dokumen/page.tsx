import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dokumen & Sumber Daya | PSI Surabaya",
  description: "Dokumen unduhan, pedoman, dan sumber daya dari Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

const CATEGORY_ICONS: Record<string, string> = {
  Pedoman: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25",
  Formulir: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
  "Laporan": "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z",
};

export default async function DokumenPage() {
  const documents = await prisma.documentResource.findMany({
    where: { isPublic: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      category: true,
      description: true,
      fileUrl: true,
      fileType: true,
      fileSize: true,
      createdAt: true,
    },
  });

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Dokumen & Sumber Daya
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Dokumen unduhan, pedoman, formulir, dan sumber daya lainnya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {documents.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada dokumen yang tersedia.</p>
          </div>
        ) : (
          categories.map((category) => {
            const catDocs = documents.filter((d) => d.category === category);
            const iconPath = CATEGORY_ICONS[category] ?? CATEGORY_ICONS["Pedoman"];
            return (
              <div key={category} className="mb-8">
                <h2 className="mb-4 text-lg font-bold text-neutral-900">{category}</h2>
                <div className="space-y-3">
                  {catDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-card transition-shadow hover:shadow-elevated sm:p-5"
                    >
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                        <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-neutral-900">{doc.title}</h3>
                        {doc.description && (
                          <p className="mt-0.5 line-clamp-1 text-sm text-neutral-500">{doc.description}</p>
                        )}
                        <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                          {doc.fileType && <span className="uppercase font-medium">{doc.fileType}</span>}
                          {doc.fileSize && <span>{doc.fileSize}</span>}
                          <span>
                            {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(doc.createdAt))}
                          </span>
                        </div>
                      </div>
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Unduh
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
