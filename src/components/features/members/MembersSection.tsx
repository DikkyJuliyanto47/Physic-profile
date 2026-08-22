import { Building2, Search } from "lucide-react";
import Image from "next/image";

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
    <div className="space-y-6">
      <form action="/members" className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

        <input
          type="search"
          name="search"
          defaultValue={query}
          placeholder="Cari nama atau universitas..."
          className="h-12 w-full rounded-md border border-border bg-white pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
        />
      </form>

      {filteredMembers.length > 0 ? (
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className="
                group rounded-xl border border-border bg-white
                p-5 shadow-sm transition-all duration-200
                hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-md
              "
            >
              <div className="flex items-center gap-3">
                {member.photo ? (
                  <Image
                    src={member.photo}
                    alt={member.name}
                    width={56}
                    height={56}
                    unoptimized
                    className="h-14 w-14 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-600">
                    {getInitials(member.name)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-base font-semibold text-neutral-900">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-primary-600">
                    {member.field}
                  </p>

                  <p className="mt-1 truncate text-sm text-neutral-500">
                    {member.email}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-sm text-neutral-500">
                    <Building2 className="h-4 w-4 shrink-0" />
                    <span className="truncate">{member.institution}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end border-neutral-100 pt-3"></div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-neutral-300 px-6 py-10 text-center">
          <p className="text-sm text-foreground-muted">
            Anggota tidak ditemukan.
          </p>
        </div>
      )}
    </div>
  );
}
