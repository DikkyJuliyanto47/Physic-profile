import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Akademik | PSI Surabaya",
  description: "Program akademik, pendidikan, dan pengembangan keahlian dari Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

export default async function AkademikPage() {
  const [totalAnggota, expertiseGroups] = await Promise.all([
    prisma.user.count({ where: { isActive: true } }),
    prisma.memberProfile.groupBy({
      by: ["fieldOfExpertise"],
      where: { user: { isActive: true }, fieldOfExpertise: { not: null } },
      _count: true,
      orderBy: { _count: { fieldOfExpertise: "desc" } },
    }),
  ]);

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Akademik</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Program pendidikan, pengembangan keahlian, dan riset dari PSI Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-card">
            <p className="text-3xl font-bold text-primary-600">{totalAnggota}</p>
            <p className="mt-1 text-sm text-neutral-500">Dosen & Peneliti</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-card">
            <p className="text-3xl font-bold text-primary-600">{expertiseGroups.length}</p>
            <p className="mt-1 text-sm text-neutral-500">Bidang Keahlian</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 text-center shadow-card">
            <p className="text-3xl font-bold text-primary-600">
              {await prisma.publication.count()}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Publikasi Ilmiah</p>
          </div>
        </div>

        {/* Bidang Keahlian */}
        {expertiseGroups.length > 0 && (
          <section className="mb-10">
            <h2 className="mb-5 text-xl font-bold text-neutral-900">Bidang Keahlian Anggota</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {expertiseGroups.map((group) => (
                <div
                  key={group.fieldOfExpertise}
                  className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-card"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-50 text-sm font-bold text-primary-600">
                    {group._count}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900">{group.fieldOfExpertise}</p>
                    <p className="text-xs text-neutral-400">anggota</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Info Sections */}
        <section className="mb-10">
          <h2 className="mb-5 text-xl font-bold text-neutral-900">Program Akademik</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900">Seminar & Kuliah Tamu</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Kuliah tamu dan seminar dengan narasumber dari dalam dan luar negeri.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50">
                <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 3.19A1.125 1.125 0 014.5 17.29V6.71a1.125 1.125 0 011.536-1.06l5.384 3.19m0 6.33zm0-6.33l5.384 3.19A1.125 1.125 0 0118.5 11.29V6.71a1.125 1.125 0 00-1.536-1.06l-5.384 3.19" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900">Workshop & Pelatihan</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Pelatihan metodologi penelitian, penggunaan perangkat lunak, dan teknik laboratorium.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                <svg className="h-5 w-5 text-teal-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900">Kolaborasi Riset</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Jaringan kolaborasi riset antar perguruan tinggi dan institusi nasional/internasional.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50">
                <svg className="h-5 w-5 text-amber-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900">Publikasi & Jurnal</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Penerbitan jurnal ilmiah, prosiding seminar, dan publikasi karya tulis anggota.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Ingin Berpartisipasi?</h2>
          <p className="mt-2 text-primary-100">
            Ikuti kegiatan akademik dan kolaborasi riset bersama PSI Surabaya.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/agenda"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              Lihat Agenda Kegiatan
            </Link>
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-400/40 bg-primary-800/50 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-primary-500/50"
            >
              Hubungi Kami
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
