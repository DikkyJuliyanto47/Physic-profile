import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getUniversityBySlug, getMembersByUniversity } from "@/lib/data";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const uni = await getUniversityBySlug(slug);

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
      ...(uni.logoUrl && {
        images: [{ url: uni.logoUrl, width: 200, height: 200, alt: uni.name }],
      }),
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
  const uni = await getUniversityBySlug(slug);

  if (!uni) notFound();

  const members = await getMembersByUniversity(uni.id);

  return (
    <div className="bg-neutral-50">
      <section className="border-b border-primary-800 bg-primary-900 py-10 sm:py-12 lg:py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/universities"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary-200 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Kembali ke Direktori
          </Link>

          <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center">
            {uni.logoUrl ? (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-white/15 bg-white p-2">
                <Image
                  src={uni.logoUrl}
                  alt={uni.name}
                  width={96}
                  height={96}
                  unoptimized
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center border border-primary-600 bg-primary-800 text-3xl font-bold text-white">
                {(uni.shortName ?? uni.name).charAt(0).toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-300">
                Perguruan Tinggi Anggota
              </p>

              <h1 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                {uni.shortName ?? uni.name}
              </h1>

              {uni.shortName && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-primary-200 sm:text-base">
                  {uni.name}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-14">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <div>
            {uni.description && (
              <section className="border-y border-neutral-200 py-7 sm:py-8">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
                  Tentang Institusi
                </p>

                <h2 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-neutral-900">
                  {uni.shortName ?? uni.name}
                </h2>

                <p className="mt-4 whitespace-pre-line text-sm leading-7 text-neutral-600 sm:text-base">
                  {uni.description}
                </p>
              </section>
            )}

            {members.length > 0 && (
              <section className="mt-10">
                <div className="flex items-end justify-between gap-4 border-b border-neutral-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
                      Anggota
                    </p>

                    <h2 className="mt-2 text-xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-2xl">
                      Anggota dari {uni.shortName ?? uni.name}
                    </h2>
                  </div>

                  <span className="shrink-0 text-sm text-neutral-500">
                    {members.length} anggota
                  </span>
                </div>

                <div className="divide-y divide-neutral-200 border-b border-neutral-200">
                  {members.map((member) => (
                    <div key={member.id} className="flex items-center gap-4 py-5">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden border border-neutral-200 bg-primary-50 text-sm font-bold text-primary-700">
                        {member.photoUrl ? (
                          <Image
                            src={member.photoUrl}
                            alt=""
                            width={48}
                            height={48}
                            unoptimized
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          member.name.charAt(0).toUpperCase()
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold text-neutral-900">
                          {member.name}
                        </p>

                        {member.position && (
                          <p className="mt-0.5 truncate text-sm text-neutral-500">
                            {member.position}
                          </p>
                        )}

                        {member.fieldOfExpertise && (
                          <p className="mt-0.5 truncate text-xs text-neutral-400">
                            {member.fieldOfExpertise}
                          </p>
                        )}
                      </div>

                      {(member.googleScholarUrl || member.scopusUrl) && (
                        <div className="hidden shrink-0 items-center gap-4 sm:flex">
                          {member.googleScholarUrl && (
                            <a
                              href={member.googleScholarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
                            >
                              Scholar
                            </a>
                          )}

                          {member.scopusUrl && (
                            <a
                              href={member.scopusUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-primary-600 transition-colors hover:text-primary-800"
                            >
                              Scopus
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <aside>
            <div className="border-y border-neutral-200 py-6 lg:sticky lg:top-24">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-700">
                Informasi
              </p>

              <div className="mt-5 divide-y divide-neutral-200">
                {uni.address && (
                  <div className="py-4 first:pt-0">
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                      </svg>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                          Alamat
                        </p>
                        <p className="mt-1 text-sm leading-6 text-neutral-600">
                          {uni.address}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {uni.websiteUrl && (
                  <div className="py-4">
                    <div className="flex items-start gap-3">
                      <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582" />
                      </svg>

                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                          Situs Web
                        </p>
                        <a
                          href={uni.websiteUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 block truncate text-sm font-medium text-primary-600 transition-colors hover:text-primary-800"
                        >
                          {uni.websiteUrl.replace(/^https?:\/\//, "")}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                <div className="py-4 last:pb-0">
                  <div className="flex items-start gap-3">
                    <svg className="mt-0.5 h-5 w-5 shrink-0 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 006.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
                        Anggota PSI
                      </p>
                      <p className="mt-1 text-sm font-medium text-neutral-700">
                        {members.length} anggota terdaftar
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}