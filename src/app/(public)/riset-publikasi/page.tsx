import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Riset & Publikasi | PSI Surabaya",
  description: "Publikasi ilmiah, jurnal, prosiding, dan karya tulis dari anggota Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

const TYPE_LABELS: Record<string, string> = {
  JURNAL: "Jurnal",
  BUKU: "Buku",
  HKI: "HKI",
  PROSIDING: "Prosiding",
};

const TYPE_COLORS: Record<string, string> = {
  JURNAL: "bg-blue-100 text-blue-700",
  BUKU: "bg-purple-100 text-purple-700",
  HKI: "bg-amber-100 text-amber-700",
  PROSIDING: "bg-teal-100 text-teal-700",
};

export default async function RisetPublikasiPage() {
  const publications = await prisma.publication.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      type: true,
      description: true,
      externalUrl: true,
      fileUrl: true,
      publishedAt: true,
    },
  });

  const types = [...new Set(publications.map((p) => p.type))];

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Riset & Publikasi
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Karya tulis ilmiah, jurnal, prosiding, dan publikasi dari anggota PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {publications.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada publikasi terdaftar.</p>
          </div>
        ) : (
          <>
            {/* Type Filter (display) */}
            <div className="mb-8 flex flex-wrap gap-2">
              {types.map((type) => (
                <span
                  key={type}
                  className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium ${TYPE_COLORS[type] ?? "bg-neutral-100 text-neutral-600"}`}
                >
                  {TYPE_LABELS[type] ?? type}
                  <span className="text-xs opacity-70">
                    {publications.filter((p) => p.type === type).length}
                  </span>
                </span>
              ))}
            </div>

            {/* Publications List */}
            <div className="space-y-4">
              {publications.map((pub) => (
                <div
                  key={pub.id}
                  className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50">
                    <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_COLORS[pub.type] ?? "bg-neutral-100 text-neutral-600"}`}>
                        {TYPE_LABELS[pub.type] ?? pub.type}
                      </span>
                      {pub.publishedAt && (
                        <span className="text-xs text-neutral-400">
                          {new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short", year: "numeric" }).format(new Date(pub.publishedAt))}
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 font-semibold text-neutral-900">{pub.title}</h3>
                    {pub.description && (
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{pub.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap gap-3">
                      {pub.externalUrl && (
                        <a
                          href={pub.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          Lihat Publikasi
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                          </svg>
                        </a>
                      )}
                      {pub.fileUrl && (
                        <a
                          href={pub.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
                        >
                          Unduh PDF
                          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
