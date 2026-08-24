import { Building2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Member } from "./data";

interface MembersSectionProps {
  members: Member[];
  query?: string;
}

export function MembersSection({
  members,
  query = "",
}: MembersSectionProps) {
  const keyword = query.trim().toLowerCase();

  const filteredMembers = keyword
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(keyword) ||
          member.institution.toLowerCase().includes(keyword) ||
          member.field.toLowerCase().includes(keyword),
      )
    : members;

  const groupedMembers = filteredMembers.reduce<Record<string, Member[]>>(
    (groups, member) => {
      const institution = member.institution;

      if (!groups[institution]) {
        groups[institution] = [];
      }

      groups[institution].push(member);

      return groups;
    },
    {},
  );

  function getInitials(name: string): string {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  return (
    <div className="space-y-7">
      <form action="/members" className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Cari nama, universitas, atau bidang..."
          className="h-11 w-full border border-border bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
        />
      </form>

      {Object.keys(groupedMembers).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedMembers).map(
            ([institution, institutionMembers]) => (
              <section key={institution}>
                <div className="mb-3 flex items-center gap-2 border-b border-border pb-2">
                  <Building2 className="h-4 w-4 text-primary-600" />

                  <h2 className="text-sm font-semibold text-neutral-900">
                    {institution}
                  </h2>

                  <span className="text-xs text-neutral-400">
                    {institutionMembers.length} anggota
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-x-8 gap-y-2 md:grid-cols-2">
                  {institutionMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex min-w-0 items-center gap-3 border-b border-neutral-100 py-3"
                    >
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={44}
                          height={44}
                          unoptimized
                          className="h-11 w-11 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-semibold text-primary-700">
                          {getInitials(member.name)}
                        </div>
                      )}

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-sm font-semibold text-neutral-900">
                          {member.name}
                        </h3>

                        <p className="mt-0.5 truncate text-xs font-medium text-primary-600">
                          {member.field || "Bidang belum diisi"}
                        </p>

                        <p className="mt-0.5 truncate text-xs text-neutral-500">
                          {member.email}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-end border-t border-neutral-100 pt-3">
                        {member.institutionSlug ? (
                          <Link
                            href={`/universities/${member.institutionSlug}`}
                            className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-700"
                          >
                            Detail
                          </Link>
                        ) : (
                          <span className="text-sm text-neutral-400">
                            Detail tidak tersedia
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ),
          )}
        </div>
      ) : (
        <div className="border border-dashed border-neutral-300 px-6 py-10 text-center">
          <p className="text-sm text-foreground-muted">
            Anggota tidak ditemukan.
          </p>
        </div>
      )}
    </div>
  );
}