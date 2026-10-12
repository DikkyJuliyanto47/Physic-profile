import Image from "next/image";
import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Member } from "./data";
import { UniversitiesSection } from "@/components/features/universities/UniversitiesSection";

interface MembersSectionProps {
  members: Member[];
  query?: string;
  universityDirectory?: ReactNode;
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

export function MembersSection({
  members,
  query = "",
  universityDirectory,
}: MembersSectionProps) {
  const keyword = query.trim().toLowerCase();

  const filteredMembers = keyword
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(keyword) ||
          member.institution.toLowerCase().includes(keyword) ||
          member.field.toLowerCase().includes(keyword) ||
          member.detailUrl?.toLowerCase().includes(keyword),
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
      <>
        <div className="border-y border-neutral-200 py-10 text-center">
          <p className="text-sm text-foreground-muted">
            Anggota tidak ditemukan.
          </p>
        </div>
        {universityDirectory}
      </>
    );
  }

  return (
    <div>
      <div>
        {Object.entries(groupedMembers).map(
          ([institution, institutionMembers]) => (
            <section
              id={getInstitutionId(institution)}
              key={institution}
              aria-labelledby={`${getInstitutionId(institution)}-heading`}
              className="scroll-mt-28 border-t border-neutral-200 py-7 first:border-t-0 first:pt-0"
            >
              <header className="mb-4">
                <h2 id={`${getInstitutionId(institution)}-heading`} className="wrap-anywhere text-lg font-semibold leading-6 text-primary-900">
                  {institution}
                </h2>
                <p className="mt-1 text-sm leading-5 text-foreground-muted">
                  Direktori anggota · {institutionMembers.length} anggota
                </p>
              </header>
              <div className="grid gap-x-6 sm:grid-cols-2">
                {institutionMembers.map((member) => (
                  <article
                    key={member.id}
                    className="flex min-w-0 items-start gap-4 py-4"
                  >
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt=""
                        width={64}
                        height={64}
                        unoptimized
                        className="h-16 w-16 shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-700">
                        {getInitials(member.name)}
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="wrap-anywhere text-base font-semibold leading-snug text-primary-900">
                        {member.name}
                      </h3>

                      <p className="mt-1 wrap-anywhere text-sm leading-5 text-foreground-muted">
                        {member.field}
                      </p>

                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="mt-1 block wrap-anywhere rounded-sm text-sm text-foreground-muted transition-colors hover:text-primary-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                        >
                          {member.email}
                        </a>
                      )}

                      {member.detailUrl && (
                        <a
                          href={member.detailUrl}
                          className="mt-1 inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-medium text-primary-700 transition-colors hover:text-primary-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                        >
                          Lihat Profil
                          <span className="sr-only"> {member.name}</span>
                          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ),
        )}
      </div>

      {universityDirectory ?? <UniversitiesSection />}
    </div>
  );
}
