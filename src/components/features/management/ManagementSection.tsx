"use client"

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ManagementGroup } from "./data";

interface ManagementSectionProps {
  groups: ManagementGroup[];
}

function getInitials(name: string) {
  return name
    .replace(/[.,]/g, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ManagementSection({ groups }: ManagementSectionProps) {
  // TODO: Aktifkan kembali setelah data kepengurusan dari backend sudah tersambung.
  // Gunakan langsung props `groups` yang dikirim dari parent (mis. hasil getManagementGroups()).
  // const activeGroups = groups;

  // TEMPORARY MOCK DATA — hanya digunakan untuk preview visual landing page.
  // Hapus blok ini dan aktifkan `groups` dari props di atas ketika data sudah tersedia.
  const activeGroups: ManagementGroup[] = [
    {
      id: "mock-group-1",
      title: "Pengurus Inti",
      members: [
        {
          id: "mock-member-1",
          name: "Dr. Ahmad Fauzi, M.Si.",
          role: "Ketua",
          description: "Universitas Airlangga (UNAIR)",
        },
        {
          id: "mock-member-2",
          name: "Dr. Siti Rahayu, M.Sc.",
          role: "Wakil Ketua",
          description: "Institut Teknologi Sepuluh Nopember (ITS)",
        },
        {
          id: "mock-member-3",
          name: "Budi Santoso, M.T.",
          role: "Sekretaris",
          description: "Universitas Negeri Surabaya (UNESA)",
        },
      ],
    },
    {
      id: "mock-group-2",
      title: "Bidang Riset dan Publikasi",
      members: [
        {
          id: "mock-member-4",
          name: "Dr. Rina Kusuma, M.Si.",
          role: "Koordinator",
          description: "Institut Teknologi Sepuluh Nopember (ITS)",
        },
        {
          id: "mock-member-5",
          name: "Andi Prasetyo, M.Sc.",
          role: "Anggota",
          description: "Universitas Airlangga (UNAIR)",
        },
      ],
    },
    {
      id: "mock-group-3",
      title: "Bidang Hubungan Masyarakat",
      members: [
        {
          id: "mock-member-6",
          name: "Dewi Anggraini, S.Si.",
          role: "Koordinator",
          description: "Universitas Katolik Widya Mandala Surabaya",
        },
        {
          id: "mock-member-7",
          name: "Fajar Nugroho, S.Pd.",
          role: "Anggota",
          description: "Universitas Negeri Surabaya (UNESA)",
        },
      ],
    },
  ];

  const [openId, setOpenId] = useState(activeGroups[0]?.id ?? "");

  return (
    <div className="space-y-3">
      {activeGroups.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 px-6 py-10 text-center text-sm text-foreground-muted">
          Belum ada data kepengurusan aktif.
        </div>
      ) : activeGroups.map((group) => {
        const isOpen = openId === group.id;

        return (
          <div
            key={group.id}
            className="
              overflow-hidden
              rounded-tl-xl rounded-br-xl rounded-tr-md rounded-bl-md
              border border-border bg-background
            "
          >
            <button
              onClick={() => setOpenId(isOpen ? "" : group.id)}
              className="
                flex w-full items-center justify-between
                bg-primary-900 px-5 py-4 text-left text-white
                transition-colors duration-200
                hover:bg-primary-800
              "
            >
              <div>
                <h3 className="text-lg font-bold">{group.title}</h3>
                <p className="text-xs text-white/70">
                  {group.members.length} anggota
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="divide-y divide-border/70 border-t border-border">
                  {group.members.map((member) => (
                    <div key={member.id} className="flex items-start gap-3 px-5 py-3.5">
                      <span
                        className="
                          mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center
                          rounded-full bg-primary-100 text-xs font-semibold text-primary-700
                        "
                        aria-hidden="true"
                      >
                        {getInitials(member.name)}
                      </span>

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <p className="font-semibold text-foreground">
                            {member.name}
                          </p>
                          <span className="text-[11px] font-medium uppercase tracking-wide text-primary-600">
                            {member.role}
                          </span>
                        </div>
                        <p className="mt-0.5 text-sm text-foreground-muted">
                          {member.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}