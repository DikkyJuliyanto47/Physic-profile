import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Direktori Anggota | PSI Surabaya",
  description: "Daftar dosen dan peneliti fisika yang tergabung dalam Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

export default async function AnggotaPage() {
  const members = await prisma.memberProfile.findMany({
    where: { user: { isActive: true } },
    orderBy: { user: { name: "asc" } },
    select: {
      id: true,
      photoUrl: true,
      position: true,
      fieldOfExpertise: true,
      emailPublic: true,
      googleScholarUrl: true,
      scopusUrl: true,
      orcidUrl: true,
      institution: { select: { name: true, shortName: true } },
      user: { select: { name: true } },
    },
  });

  const expertiseGroups = [...new Set(members.map((m) => m.fieldOfExpertise).filter(Boolean))] as string[];

  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Direktori Anggota
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Dosen, peneliti, dan akademisi fisika di wilayah Jawa Timur
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-card">
            <p className="text-3xl font-bold text-primary-600">{members.length}</p>
            <p className="mt-1 text-sm text-neutral-500">Total Anggota</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-card">
            <p className="text-3xl font-bold text-primary-600">
              {new Set(members.map((m) => m.institution?.name).filter(Boolean)).size}
            </p>
            <p className="mt-1 text-sm text-neutral-500">Kampus</p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-white p-5 text-center shadow-card">
            <p className="text-3xl font-bold text-primary-600">{expertiseGroups.length}</p>
            <p className="mt-1 text-sm text-neutral-500">Bidang Keahlian</p>
          </div>
        </div>

        {/* Members Grid */}
        {members.length === 0 ? (
          <div className="rounded-xl border border-neutral-200 bg-white py-16 text-center">
            <svg className="mx-auto h-12 w-12 text-neutral-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
            </svg>
            <p className="mt-4 text-neutral-500">Belum ada data anggota.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-card transition-shadow hover:shadow-elevated"
              >
                <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt="" className="h-14 w-14 rounded-full object-cover" />
                  ) : (
                    member.user.name.charAt(0)
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-neutral-900">{member.user.name}</h3>
                  {member.institution && (
                    <p className="mt-0.5 truncate text-sm text-neutral-500">
                      {member.institution.shortName ?? member.institution.name}
                    </p>
                  )}
                  {member.position && (
                    <p className="mt-0.5 truncate text-xs text-neutral-400">{member.position}</p>
                  )}
                  {member.fieldOfExpertise && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-primary-50 px-2 py-0.5 text-xs font-medium text-primary-700">
                      {member.fieldOfExpertise}
                    </span>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {member.emailPublic && (
                      <a href={`mailto:${member.emailPublic}`} className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        Email
                      </a>
                    )}
                    {member.googleScholarUrl && (
                      <a href={member.googleScholarUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        Scholar
                      </a>
                    )}
                    {member.scopusUrl && (
                      <a href={member.scopusUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        Scopus
                      </a>
                    )}
                    {member.orcidUrl && (
                      <a href={member.orcidUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        ORCID
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
