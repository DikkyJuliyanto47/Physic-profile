import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uni = await prisma.university.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: { name: true, shortName: true, description: true, logoUrl: true },
  });

  if (!uni) return { title: "Perguruan Tidak Ditemukan" };

  const displayName = uni.shortName ?? uni.name;
  const description =
    uni.description?.slice(0, 160) ??
    `Profil ${uni.name} — anggota Perhimpunan Fisikawan Indonesia Cabang Surabaya.`;

  return {
    title: displayName,
    description,
    openGraph: {
      title: displayName,
      description,
      type: "profile",
      locale: "id_ID",
      siteName: "PSI Cabang Surabaya",
      ...(uni.logoUrl && { images: [{ url: uni.logoUrl, width: 200, height: 200, alt: uni.name }] }),
    },
    twitter: {
      card: "summary",
      title: displayName,
      description,
    },
  };
}

export default async function PerguruanTinggiDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const uni = await prisma.university.findFirst({
    where: { OR: [{ slug }, { id: slug }] },
    select: {
      id: true,
      name: true,
      slug: true,
      shortName: true,
      address: true,
      websiteUrl: true,
      deptUrl: true,
      logoUrl: true,
      description: true,
      members: {
        select: {
          id: true,
          photoUrl: true,
          position: true,
          fieldOfExpertise: true,
          nidn: true,
          googleScholarUrl: true,
          scopusUrl: true,
          orcidUrl: true,
          user: { select: { name: true, email: true } },
        },
        orderBy: { user: { name: "asc" } },
      },
    },
  });

  if (!uni) notFound();

  return (
    <div className="bg-neutral-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/perguruan-tinggi"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-300 hover:text-white transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Direktori
          </Link>

          <div className="mt-6 flex items-center gap-5">
            {uni.logoUrl ? (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-white p-2">
                <img src={uni.logoUrl} alt={uni.name} className="max-h-full max-w-full object-contain" />
              </div>
            ) : (
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-primary-700 text-3xl font-bold text-white">
                {(uni.shortName ?? uni.name).charAt(0)}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white sm:text-3xl">
                {uni.shortName ?? uni.name}
              </h1>
              {uni.shortName && (
                <p className="mt-1 text-primary-200">{uni.name}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Info */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {uni.description && (
              <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
                <h2 className="mb-3 text-lg font-semibold text-neutral-900">Tentang</h2>
                <p className="whitespace-pre-line text-neutral-600 leading-relaxed">
                  {uni.description}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-card">
              <h3 className="mb-3 text-sm font-semibold uppercase text-neutral-500">Informasi</h3>
              <div className="space-y-3">
                {uni.address && (
                  <div className="flex items-start gap-2 text-sm text-neutral-600">
                    <svg className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                    {uni.address}
                  </div>
                )}
                {uni.websiteUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <svg className="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                    </svg>
                    <a
                      href={uni.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      {uni.websiteUrl}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <svg className="h-4 w-4 flex-shrink-0 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                  </svg>
                  {uni.members.length} anggota terdaftar
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Members */}
        {uni.members.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold text-neutral-900">Anggota dari {uni.shortName ?? uni.name}</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {uni.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-4 rounded-xl border border-neutral-200 bg-white p-4 shadow-card"
                >
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                    {member.photoUrl ? (
                      <img src={member.photoUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
                    ) : (
                      member.user.name.charAt(0)
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-neutral-900">{member.user.name}</p>
                    {member.position && (
                      <p className="truncate text-sm text-neutral-500">{member.position}</p>
                    )}
                    {member.fieldOfExpertise && (
                      <p className="mt-0.5 truncate text-xs text-neutral-400">{member.fieldOfExpertise}</p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    {member.googleScholarUrl && (
                      <a
                        href={member.googleScholarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Scholar
                      </a>
                    )}
                    {member.scopusUrl && (
                      <a
                        href={member.scopusUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-primary-600 hover:text-primary-700"
                      >
                        Scopus
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
