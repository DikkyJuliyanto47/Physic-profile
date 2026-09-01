import Link from "next/link";
import Image from "next/image";

import { prisma } from "@/lib/prisma";
import { UniversityActions } from "./UniversityActions";

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { shortName: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const universities = await prisma.university.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { members: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">
            Perguruan Tinggi
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola daftar kampus anggota Physical Society of Indonesia Cabang Surabaya.
          </p>
        </div>

        <Link
          href="/admin/universities/new"
          className="inline-flex items-center gap-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
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
          Tambah Kampus Baru
        </Link>
      </div>

      <form method="GET" className="max-w-md">
        <div className="relative">
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
            placeholder="Cari nama kampus atau singkatan..."
            className="w-full rounded-md border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
      </form>

      <div className="border border-neutral-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-600">
                  Kampus
                </th>
                <th className="px-5 py-3 font-medium text-neutral-600">
                  Website
                </th>
                <th className="px-5 py-3 font-medium text-neutral-600">
                  Anggota
                </th>
                <th className="px-5 py-3 text-right font-medium text-neutral-600">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody>
              {universities.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-12 text-center text-neutral-500"
                  >
                    {q
                      ? `Tidak ada kampus yang cocok dengan "${q}".`
                      : "Belum ada data kampus."}
                  </td>
                </tr>
              ) : (
                universities.map((uni) => (
                  <tr
                    key={uni.id}
                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {uni.logoUrl ? (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-neutral-200 bg-white">
                            <Image
                              src={uni.logoUrl}
                              alt={uni.name}
                              width={40}
                              height={40}
                              unoptimized
                              className="h-full w-full object-contain"
                            />
                          </div>
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary-50 text-sm font-bold text-primary-700">
                            {(uni.shortName ?? uni.name).charAt(0)}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-neutral-900">
                            {uni.name}
                          </p>

                          {uni.shortName && (
                            <p className="text-xs text-neutral-500">
                              {uni.shortName}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3">
                      {uni.websiteUrl ? (
                        <a
                          href={uni.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 hover:underline"
                        >
                          {uni.websiteUrl
                            .replace(/^https?:\/\//, "")
                            .slice(0, 30)}
                        </a>
                      ) : (
                        <span className="text-neutral-400">-</span>
                      )}
                    </td>

                    <td className="px-5 py-3 text-neutral-600">
                      {uni._count.members} anggota
                    </td>

                    <td className="px-5 py-3 text-right">
                      <UniversityActions
                        universityId={uni.id}
                        universityName={uni.name}
                        memberCount={uni._count.members}
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