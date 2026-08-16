/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 07:49:26 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 16:00:00
 */

"use client"

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ManagementGroup } from "./data";

interface ManagementSectionProps {
  groups: ManagementGroup[];
}

export function ManagementSection({ groups }: ManagementSectionProps) {
  const [openId, setOpenId] = useState(groups[0]?.id ?? "");

  return (
    <div className="space-y-3">
      {groups.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-300 px-6 py-10 text-center text-sm text-foreground-muted">
          Belum ada data kepengurusan aktif.
        </div>
      ) : groups.map((group) => {
        const isOpen = openId === group.id;

        return (
          <div
            key={group.id}
            className="overflow-hidden rounded-md border border-border bg-background"
          >
            <button
              onClick={() => setOpenId(isOpen ? "" : group.id)}
              className="flex w-full items-center justify-between bg-primary-900 px-5 py-4 text-left text-white"
            >
              <div>
                <h3 className="text-lg font-bold">{group.title}</h3>
                <p className="text-xs text-white/70">
                  {group.members.length} anggota
                </p>
              </div>

              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>

            {isOpen && (
              <div className="space-y-3 border-t border-border px-5 py-4">
                {group.members.map((member) => (
                  <div key={member.id}>
                    <p className="font-semibold text-foreground">
                      {member.name}
                    </p>
                    <p className="text-sm text-foreground-muted">
                      {member.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
