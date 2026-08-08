/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 09:28:21 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 09:28:58
 */

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import {
  expertiseFields,
  institutions,
  members,
} from "./data";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

interface ProfileLinkProps {
  label: string;
  href?: string;
}

function ProfileLink({ label, href }: ProfileLinkProps) {
  const isAvailable = Boolean(href && href !== "#");

  if (!isAvailable) {
    return (
      <span className="flex items-center justify-center rounded-md border border-neutral-200 bg-neutral-50 px-2.5 py-2 text-[11px] font-medium text-neutral-400">
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-center rounded-md border border-primary-200 bg-white px-2.5 py-2 text-[11px] font-medium text-primary-600 transition-colors hover:bg-primary-50"
    >
      {label}
    </a>
  );
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

function BuildingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M4 21h16" />
      <path d="M6 21V5a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v16" />
      <path d="M9 8h2" />
      <path d="M13 8h2" />
      <path d="M9 12h2" />
      <path d="M13 12h2" />
      <path d="M9 16h2" />
      <path d="M13 16h2" />
    </svg>
  );
}

function ResearchIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4"
    >
      <path d="M9 3h6" />
      <path d="M10 3v5l-5.5 9.2A2.5 2.5 0 0 0 6.65 21h10.7a2.5 2.5 0 0 0 2.15-3.8L14 8V3" />
      <path d="M8 14h8" />
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
  const [institution, setInstitution] =
    useState("Semua Universitas");
  const [expertise, setExpertise] =
    useState("Semua Bidang");

  const filteredMembers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        !keyword ||
        member.name.toLowerCase().includes(keyword) ||
        member.institution.toLowerCase().includes(keyword) ||
        member.expertise.toLowerCase().includes(keyword);

      const matchesInstitution =
        institution === "Semua Universitas" ||
        member.institution === institution;

      const matchesExpertise =
        expertise === "Semua Bidang" ||
        member.expertise === expertise;

      return (
        matchesSearch &&
        matchesInstitution &&
        matchesExpertise
      );
    });
  }, [search, institution, expertise]);

  return (
    <section className="bg-[#F5F8FC] py-10 md:py-14">
      <div className="mx-auto w-full max-w-(--container-max) px-6 md:px-8">

        <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:p-5">
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_220px]">

            {/* Search */}
            <div className="relative">
              <label
                htmlFor="member-search"
                className="sr-only"
              >
                Cari anggota
              </label>

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <SearchIcon />
              </span>

              <input
                id="member-search"
                type="search"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Cari nama, universitas, atau bidang penelitian..."
                className="h-11 w-full rounded-md border border-neutral-300 bg-white pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-neutral-400 focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              />
            </div>

            {/* Unit / Perguruan Tinggi */}
            <div className="relative">
              <label
                htmlFor="member-institution"
                className="sr-only"
              >
                Perguruan tinggi
              </label>

              <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-400">
                <BuildingIcon />
              </span>

              <select
                id="member-institution"
                value={institution}
                onChange={(event) =>
                  setInstitution(event.target.value)
                }
                className="h-11 w-full appearance-none rounded-md border border-neutral-300 bg-white pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              >
                {institutions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

            {/* Bidang Penelitian */}
            <div className="relative">
              <label
                htmlFor="member-expertise"
                className="sr-only"
              >
                Bidang penelitian
              </label>

              <span className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-neutral-400">
                <ResearchIcon />
              </span>

              <select
                id="member-expertise"
                value={expertise}
                onChange={(event) =>
                  setExpertise(event.target.value)
                }
                className="h-11 w-full appearance-none rounded-md border border-neutral-300 bg-white pl-11 pr-4 text-sm text-foreground outline-none transition-colors focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
              >
                {expertiseFields.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </span>
            </div>

          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-medium text-foreground">
            {filteredMembers.length} Anggota
          </h2>

          <div className="mt-2 h-px w-64 bg-neutral-300" />
        </div>

        {/* Member Cards */}
        {filteredMembers.length > 0 ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {filteredMembers.map((member) => {
              const initials = getInitials(member.name);

              return (
                <article
                  key={member.id}
                  className="flex h-full flex-col rounded-lg border border-neutral-200 bg-white p-4 shadow-sm transition-shadow duration-200 hover:shadow-md"
                >
                  {/* Profile */}
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

                  {/* Institution */}
                  <div className="mt-4">
                    <p className="text-xs font-medium leading-5 text-foreground">
                      {member.institution}
                    </p>
                  </div>

                  {/* Email */}
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

                  {/* Academic Profiles */}
                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <ProfileLink
                      label="Scholar"
                      href={member.googleScholar}
                    />

                    <ProfileLink
                      label="Scopus"
                      href={member.scopus}
                    />

                    <ProfileLink
                      label="ORCID"
                      href={member.orcid}
                    />
                  </div>

                  {/* Profile Button */}
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
          <div className="mt-8 rounded-lg border border-dashed border-neutral-300 bg-white px-6 py-12 text-center">
            <p className="text-sm text-foreground-muted">
              Anggota tidak ditemukan.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}