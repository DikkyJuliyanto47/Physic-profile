/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 09:28:21 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 17:00:00
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { members } from "./data";

const PREVIEW_COUNT = 3;

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function hasLink(href?: string) {
  return Boolean(href && href !== "#");
}

function SearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

export function MembersSection() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PREVIEW_COUNT);

  const filteredMembers = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return members;

    return members.filter(
      (member) =>
        member.name.toLowerCase().includes(keyword) ||
        member.institution.toLowerCase().includes(keyword) ||
        member.expertise.toLowerCase().includes(keyword),
    );
  }, [search]);

  const visibleMembers = filteredMembers.slice(0, visibleCount);
  const hasMore = visibleCount < filteredMembers.length;

  return (
    <div className="flex flex-col gap-8">
      <div className="relative">
        <label htmlFor="member-search" className="sr-only">
          Cari anggota
        </label>

        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
          <SearchIcon />
        </span>

        <input
          id="member-search"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setVisibleCount(PREVIEW_COUNT);
          }}
          placeholder="Cari nama, universitas, atau bidang penelitian....."
          className="h-12 w-full rounded-lg border border-neutral-300 bg-white pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
        />
      </div>

      {visibleMembers.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleMembers.map((member) => {
            const initials = getInitials(member.name);

            return (
              <article
                key={member.id}
                className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {member.photo ? (
                    <img
                      src={member.photo}
                      alt={`Foto ${member.name}`}
                      className="h-14 w-14 shrink-0 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-semibold text-primary-600"
                    >
                      {initials}
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-foreground">
                      {member.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-4 text-primary-600">
                      {member.expertise}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-neutral-100 pt-3">
                  <span className="shrink-0 text-neutral-400">
                    <MailIcon />
                  </span>
                  <a
                    href={`mailto:${member.email}`}
                    className="truncate text-xs text-foreground-muted transition-colors hover:text-primary-600"
                  >
                    {member.email}
                  </a>
                </div>

                <div className="mt-4 flex items-center gap-4">
                  {hasLink(member.scopus) ? (
                    <a
                      href={member.scopus}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-bold italic text-[#E9711C] transition-opacity hover:opacity-80"
                    >
                      Scopus
                    </a>
                  ) : (
                    <span className="text-sm font-bold italic text-neutral-300">
                      Scopus
                    </span>
                  )}

                  {hasLink(member.orcid) ? (
                    <a
                      href={member.orcid}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm font-semibold text-[#A6CE39] transition-opacity hover:opacity-80"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#A6CE39] text-[9px] font-bold text-white">
                        iD
                      </span>
                      ORCID
                    </a>
                  ) : null}
                </div>

                <div className="mt-4">
                  <Link
                    href={`/anggota/${member.slug}`}
                    className="flex min-h-9 w-full items-center justify-center rounded-md border border-primary-300 bg-white px-3 py-2 text-xs font-medium text-primary-600 transition-colors hover:bg-primary-50"
                  >
                    Lihat Profil →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
          <p className="text-sm text-foreground-muted">
            Anggota tidak ditemukan.
          </p>
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={() => setVisibleCount(filteredMembers.length)}
          className="flex w-full items-center justify-center rounded-lg bg-primary-600 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          Lihat Selengkapnya →
        </button>
      )}
    </div>
  );
}