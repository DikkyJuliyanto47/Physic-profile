import Image from "next/image";
import { Search } from "lucide-react";

import type { Member } from "./data";

interface MembersSectionProps {
  members: Member[];
  query?: string;
}

function getInstitutionId(institution: string) {
  return institution
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function MembersSection({ members, query = "" }: MembersSectionProps) {
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
      groups[member.institution] ??= [];
      groups[member.institution].push(member);
      return groups;
    },
    {},
  );

  if (!Object.keys(groupedMembers).length) {
    return (
      <div className="border-y border-neutral-200 py-10 text-center">
        <p className="text-sm text-foreground-muted">
          Anggota tidak ditemukan.
        </p>
      </div>
    );
  }

  return (
    <div>
      <form action="/members" className="relative mb-10">
        <Search
          className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
          aria-hidden="true"
        />
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Cari nama, universitas, atau bidang..."
          className="h-11 w-full border border-neutral-300 bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600"
        />
      </form>

      <div>
        {Object.entries(groupedMembers).map(([institution, institutionMembers]) => (
          <section
            id={getInstitutionId(institution)}
            key={institution}
            className="scroll-mt-28 border-t border-neutral-200 py-10 first:border-t-0 first:pt-0 lg:py-12"
          >
            <div className="grid gap-x-10 gap-y-9 sm:grid-cols-2">
              {institutionMembers.map((member) => (
                <article
                  key={member.id}
                  className="flex min-w-0 items-center gap-5"
                >
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={72}
                      height={72}
                      unoptimized
                      className="h-18 w-18 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-18 w-18 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                      {getInitials(member.name)}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h2 className="truncate text-base font-semibold leading-snug text-foreground">
                      {member.name}
                    </h2>

                    <p className="mt-1 truncate text-sm font-medium text-primary-700">
                      {member.field}
                    </p>

                    <a
                      href={`mailto:${member.email}`}
                      className="mt-1 block truncate text-sm text-foreground-muted transition-colors hover:text-primary-700"
                    >
                      {member.email}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}