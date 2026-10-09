import Image from "next/image";
import { Search, Users } from "lucide-react";

import type { ManagementGroup } from "./data";

interface ManagementSectionProps {
  groups: ManagementGroup[];
  query?: string;
}

function getInitials(name: string) {
  return name.trim().split(/\s+/).slice(0, 2)
    .map((word) => word.charAt(0)).join("").toUpperCase();
}

export function ManagementSection({ groups, query }: ManagementSectionProps) {
  return (
    <div>
      <header className="mb-6 max-w-2xl">
        <h2 className="text-xl font-semibold leading-7 tracking-tight text-primary-900">
          Struktur Kepengurusan
        </h2>
        <p className="mt-2 text-sm leading-6 text-foreground-muted">
          Susunan pengurus PSI Cabang Surabaya berdasarkan periode aktif,
          jabatan, dan bidang organisasi yang tercatat.
        </p>
      </header>

      {groups.length === 0 ? (
        <div className="flex items-start gap-3 rounded-md bg-background-muted p-5">
          <Users aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 text-primary-700" />
          <p className="wrap-anywhere text-sm leading-6 text-foreground-muted">
            {query ? `Tidak ditemukan anggota untuk "${query}".` : "Belum ada data kepengurusan aktif."}
          </p>
        </div>
      ) : (
        <>
          <form action="/management" className="relative mb-6 max-w-xl">
            <Search
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
              aria-hidden="true"
            />
            <label htmlFor="management-search" className="sr-only">
              Cari anggota
            </label>
            <input
              id="management-search"
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Cari nama, universitas, atau bidang..."
              className="h-11 w-full rounded-md border border-neutral-300 bg-background pl-10 pr-3 text-sm text-foreground transition-colors duration-150 hover:border-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none"
            />
          </form>

          {groups.map((group) => (
            <section
              id={group.id}
              key={group.id}
              aria-labelledby={`management-${group.id}-heading`}
              className="scroll-mt-28 border-t border-neutral-200 py-6"
            >
              <h3
                id={`management-${group.id}-heading`}
                className="mb-5 wrap-anywhere text-base font-semibold leading-6 text-primary-900"
              >
                {group.title}
              </h3>

              {group.members.length > 0 ? (
                <ol className={group.members.length > 1 ? "grid gap-x-6 gap-y-5 sm:grid-cols-2" : "grid gap-5"}>
                  {group.members.map((member) => (
                    <li key={member.id} className="min-w-0">
                      <article className="flex min-w-0 items-start gap-4">
                        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-50">
                          {member.image && member.image !== "/assets/members/profile.jpg" ? (
                            <Image
                              src={member.image}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <span aria-hidden="true" className="text-sm font-semibold text-primary-700">
                              {getInitials(member.name)}
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="wrap-anywhere text-base font-semibold leading-6 text-primary-900">
                            {member.name}
                          </h4>
                          <p className="mt-1 wrap-anywhere text-sm font-medium leading-5 text-primary-700">
                            {member.role}
                          </p>
                          {member.email && (
                            <a
                              href={`mailto:${member.email}`}
                              className="mt-1.5 inline-block max-w-full rounded-sm wrap-anywhere text-sm leading-5 text-foreground-muted transition-colors duration-150 hover:text-primary-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none"
                            >
                              {member.email}
                            </a>
                          )}
                        </div>
                      </article>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm leading-6 text-foreground-muted">
                  Belum ada susunan pengurus yang tercatat untuk periode ini.
                </p>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
