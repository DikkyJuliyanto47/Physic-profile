import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { MemberActions } from "@/components/ui/actions/MemberActions";

export default async function MembersListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; universityId?: string }>;
}) {
  const { q, universityId } = await searchParams;

  const where: Prisma.MemberProfileWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { fieldOfExpertise: { contains: q, mode: "insensitive" } },
    ];
  }

  if (universityId) {
    where.institutionId = universityId;
  }

  const [members, universities] = await Promise.all([
    prisma.memberProfile.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        position: true,
        fieldOfExpertise: true,
        photoUrl: true,
        nidn: true,
        emailPublic: true,
        googleScholarUrl: true,
        scopusUrl: true,
        orcidUrl: true,
        institution: {
          select: { id: true, name: true, shortName: true },
        },
      },
    }),
    prisma.university.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, shortName: true },
    }),
  ]);

  return (
    <div className="w-full min-w-0">
      <div className="space-y-6 sm:space-y-8">
        <header>
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl">
            Anggota & Pengurus
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-neutral-500">
            Kelola data anggota Physical Society of Indonesia Cabang Surabaya.
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <form
            method="GET"
            className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row"
          >
            <div className="relative min-w-0 flex-1">
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>

              <input
                name="q"
                defaultValue={q ?? ""}
                placeholder="Cari nama, email, atau bidang keahlian..."
                className="h-10 w-full rounded-md border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 shadow-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <select
              name="universityId"
              defaultValue={universityId ?? ""}
              className="h-10 rounded-md border border-neutral-200 bg-white px-3.5 text-sm text-neutral-700 shadow-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Semua Kampus</option>
              {universities.map((uni) => (
                <option key={uni.id} value={uni.id}>
                  {uni.shortName ?? uni.name}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="h-10 shrink-0 rounded-md border border-neutral-200 bg-white px-4 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
            >
              Filter
            </button>
          </form>

          <Link
            href="/admin/members/new"
            className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
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
                d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
            Tambah Anggota
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-card">
          <div className="border-b border-neutral-100 px-5 py-4 sm:px-6">
            <p className="text-sm font-semibold text-neutral-900">
              Daftar Anggota
            </p>
            <p className="mt-0.5 text-xs text-neutral-500">
              {members.length} anggota terdaftar.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-200 text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70">
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Anggota
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Kampus
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Jabatan
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Akademik
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-neutral-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {members.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-5 py-14 text-center text-sm text-neutral-500"
                    >
                      {q || universityId
                        ? "Tidak ada anggota yang cocok dengan filter."
                        : "Belum ada anggota terdaftar."}
                    </td>
                  </tr>
                ) : (
                  members.map((member) => {
                    const uni = member.institution;

                    return (
                      <tr
                        key={member.id}
                        className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {member.photoUrl ? (
                              <Image
                                src={member.photoUrl}
                                alt={member.name}
                                width={40}
                                height={40}
                                unoptimized
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                                {member.name.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-medium text-neutral-900">
                                {member.name}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-neutral-500">
                                {member.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          {uni ? (
                            <div className="max-w-44">
                              <p className="truncate text-sm text-neutral-800">
                                {uni.shortName ?? uni.name}
                              </p>
                              {uni.shortName && (
                                <p className="mt-0.5 truncate text-xs text-neutral-400">
                                  {uni.name}
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          {member.position ? (
                            <p className="text-sm text-neutral-800">
                              {member.position}
                            </p>
                          ) : (
                            <span className="text-neutral-400">—</span>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 text-xs">
                            {member.nidn && (
                              <span
                                className="font-medium text-neutral-500"
                                title={`NIDN: ${member.nidn}`}
                              >
                                NIDN
                              </span>
                            )}

                            {member.emailPublic && (
                              <a
                                href={`mailto:${member.emailPublic}`}
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title={`Email: ${member.emailPublic}`}
                              >
                                Email
                              </a>
                            )}

                            {member.googleScholarUrl && (
                              <a
                                href={member.googleScholarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title="Google Scholar"
                              >
                                GS
                              </a>
                            )}

                            {member.scopusUrl && (
                              <a
                                href={member.scopusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title="Scopus"
                              >
                                Scopus
                              </a>
                            )}

                            {member.orcidUrl && (
                              <a
                                href={member.orcidUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title="ORCID"
                              >
                                ORCID
                              </a>
                            )}

                            {!member.nidn &&
                              !member.emailPublic &&
                              !member.googleScholarUrl &&
                              !member.scopusUrl &&
                              !member.orcidUrl && (
                                <span className="text-neutral-400">—</span>
                              )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <MemberActions
                            memberId={member.id}
                            memberName={member.name}
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
