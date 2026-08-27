import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Prisma, Role } from "@/generated/prisma/client";
import { MemberActions } from "./MemberActions";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  MEMBER: "Anggota",
};

const ROLE_COLORS: Record<Role, string> = {
  SUPER_ADMIN: "bg-red-50 text-red-700",
  ADMIN: "bg-purple-50 text-purple-700",
  MEMBER: "bg-blue-50 text-blue-700",
};

export default async function MembersListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; universityId?: string; role?: string }>;
}) {
  const { q, universityId, role } = await searchParams;
  const session = await auth();

  const where: Prisma.UserWhereInput = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      {
        memberProfile: {
          fieldOfExpertise: { contains: q, mode: "insensitive" },
        },
      },
    ];
  }

  if (universityId) {
    where.memberProfile = { institutionId: universityId };
  }

  if (role && ["SUPER_ADMIN", "ADMIN", "MEMBER"].includes(role)) {
    where.role = role as Role;
  }

  const [users, universities] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        memberProfile: {
          include: {
            institution: {
              select: { id: true, name: true, shortName: true },
            },
          },
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
            Kelola data anggota dan pengurus PSI Surabaya.
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

            <select
              name="role"
              defaultValue={role ?? ""}
              className="h-10 rounded-md border border-neutral-200 bg-white px-3.5 text-sm text-neutral-700 shadow-sm outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
            >
              <option value="">Semua Role</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Anggota</option>
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
              {users.length} anggota terdaftar.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-240 text-left text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50/70">
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Anggota
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Kampus
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Role & Jabatan
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Akademik
                  </th>
                  <th className="px-5 py-3 text-xs font-medium text-neutral-500">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-neutral-500">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-5 py-14 text-center text-sm text-neutral-500"
                    >
                      {q || universityId || role
                        ? "Tidak ada anggota yang cocok dengan filter."
                        : "Belum ada anggota terdaftar."}
                    </td>
                  </tr>
                ) : (
                  users.map((user) => {
                    const profile = user.memberProfile;
                    const uni = profile?.institution;
                    const isCurrentUser = session?.user?.id === user.id;

                    return (
                      <tr
                        key={user.id}
                        className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50/60"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {profile?.photoUrl ? (
                              <Image
                                src={profile.photoUrl}
                                alt={user.name}
                                width={40}
                                height={40}
                                unoptimized
                                className="h-10 w-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="truncate font-medium text-neutral-900">
                                {user.name}
                              </p>
                              <p className="mt-0.5 truncate text-xs text-neutral-500">
                                {user.email}
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
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[user.role]}`}
                          >
                            {ROLE_LABELS[user.role]}
                          </span>

                          {profile?.position && (
                            <p className="mt-1 text-xs text-neutral-500">
                              {profile.position}
                            </p>
                          )}
                        </td>

                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 text-xs">
                            {profile?.nidn && (
                              <span
                                className="font-medium text-neutral-500"
                                title={`NIDN: ${profile.nidn}`}
                              >
                                NIDN
                              </span>
                            )}

                            {profile?.googleScholarUrl && (
                              <a
                                href={profile.googleScholarUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title="Google Scholar"
                              >
                                GS
                              </a>
                            )}

                            {profile?.scopusUrl && (
                              <a
                                href={profile.scopusUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title="Scopus"
                              >
                                Scopus
                              </a>
                            )}

                            {profile?.orcidUrl && (
                              <a
                                href={profile.orcidUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-medium text-neutral-500 underline decoration-neutral-300 underline-offset-2 hover:text-neutral-900"
                                title="ORCID"
                              >
                                ORCID
                              </a>
                            )}

                            {!profile?.nidn &&
                              !profile?.googleScholarUrl &&
                              !profile?.scopusUrl &&
                              !profile?.orcidUrl && (
                                <span className="text-neutral-400">—</span>
                              )}
                          </div>
                        </td>

                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                              user.isActive
                                ? "text-green-700"
                                : "text-neutral-500"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                user.isActive
                                  ? "bg-green-500"
                                  : "bg-neutral-400"
                              }`}
                            />
                            {user.isActive ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>

                        <td className="px-5 py-3.5 text-right">
                          <MemberActions
                            memberId={user.id}
                            memberName={user.name}
                            isActive={user.isActive}
                            isCurrentUser={isCurrentUser}
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