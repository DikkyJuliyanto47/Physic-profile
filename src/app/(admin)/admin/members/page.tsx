import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Role } from "@/generated/prisma/client";
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

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { memberProfile: { fieldOfExpertise: { contains: q, mode: "insensitive" } } },
    ];
  }

  if (universityId) {
    where.memberProfile = {
      ...((where.memberProfile as Record<string, unknown>) || {}),
      institutionId: universityId,
    };
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
          include: { institution: { select: { id: true, name: true, shortName: true } } },
        },
      },
    }),
    prisma.university.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Anggota & Pengurus</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola data anggota dan pengurus PSI Surabaya.
          </p>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tambah Anggota Baru
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Cari nama, email, atau bidang keahlian..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          name="universityId"
          defaultValue={universityId ?? ""}
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
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
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="">Semua Role</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="MEMBER">Anggota</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-600">Anggota</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Kampus</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Role & Jabatan</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Akademik</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-5 py-3 text-right font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-neutral-500">
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
                      className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                    >
                      <td className="px-5 py-3">
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
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
                              {user.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-neutral-900">{user.name}</p>
                            <p className="text-xs text-neutral-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        {uni ? (
                          <div>
                            <p className="text-sm text-neutral-900">
                              {uni.shortName ?? uni.name}
                            </p>
                          </div>
                        ) : (
                          <span className="text-sm text-neutral-400">-</span>
                        )}
                      </td>
                      <td className="px-5 py-3">
                        <div>
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
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          {profile?.nidn && (
                            <span className="text-xs text-neutral-500" title={`NIDN: ${profile.nidn}`}>
                              NIDN
                            </span>
                          )}
                          {profile?.googleScholarUrl && (
                            <a
                              href={profile.googleScholarUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded bg-yellow-50 px-1.5 py-0.5 text-xs font-medium text-yellow-700 hover:bg-yellow-100"
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
                              className="rounded bg-orange-50 px-1.5 py-0.5 text-xs font-medium text-orange-700 hover:bg-orange-100"
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
                              className="rounded bg-green-50 px-1.5 py-0.5 text-xs font-medium text-green-700 hover:bg-green-100"
                              title="ORCID"
                            >
                              ORCID
                            </a>
                          )}
                          {!profile?.nidn &&
                            !profile?.googleScholarUrl &&
                            !profile?.scopusUrl &&
                            !profile?.orcidUrl && (
                              <span className="text-sm text-neutral-400">-</span>
                            )}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-neutral-100 text-neutral-600"
                          }`}
                        >
                          {user.isActive ? "Aktif" : "Nonaktif"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
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
  );
}
