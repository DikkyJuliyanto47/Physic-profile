import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perguruan Tinggi Anggota | PSI Surabaya",
  description: "Direktori perguruan tinggi yang tergabung dalam Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

export default async function PerguruanTinggiPage() {
  const universities = await prisma.university.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      address: true,
      websiteUrl: true,
      logoUrl: true,
      description: true,
      _count: { select: { members: true } },
    },
  });

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-linear-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Perguruan Tinggi Anggota
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Jaringan perguruan tinggi di Jawa Timur yang tergabung dalam PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {universities.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada data perguruan tinggi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {universities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.slug ?? uni.id}`}
                className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-card transition-all hover:border-primary-200 hover:shadow-elevated"
              >
                {uni.logoUrl ? (
                  <div className="flex h-40 items-center justify-center bg-neutral-50 p-6">
                    <Image
                      src={uni.logoUrl}
                      alt={uni.name}
                      width={160}
                      height={160}
                      unoptimized
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="flex h-40 items-center justify-center bg-linear-to-br from-primary-50 to-primary-100">
                    <span className="text-4xl font-bold text-primary-300">
                      {(uni.shortName ?? uni.name).charAt(0)}
                    </span>
                  </div>
                )}
                <div className="p-5">
                  <h2 className="text-lg font-semibold text-neutral-900 group-hover:text-primary-600">
                    {uni.shortName ?? uni.name}
                  </h2>
                  {uni.shortName && (
                    <p className="mt-0.5 text-sm text-neutral-500">{uni.name}</p>
                  )}
                  {uni.address && (
                    <div className="mt-3 flex items-start gap-2 text-sm text-neutral-500">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>
                      <span className="line-clamp-2">{uni.address}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center justify-between border-t border-neutral-100 pt-3">
                    <span className="text-xs text-neutral-400">
                      {uni._count.members} anggota
                    </span>
                    {uni.websiteUrl && (
                      <span className="text-xs font-medium text-primary-600">
                        Kunjungi Website
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
