/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:14:26 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-02 09:14:26 
 */

import Link from "next/link";
import { Container, Section, SectionHeading } from "@/components/ui/index";
import { members } from "./data";

export function MembersSection() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-8">
        <SectionHeading
          eyebrow="Anggota"
          title="Anggota PSI Surabaya"
          action={
            <Link
              href="/members"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700"
            >
              Lihat Semua Anggota →
            </Link>
          }
        />
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-5 text-center"
            >
              <span className="h-16 w-16 rounded-full bg-neutral-200" />
              <div className="flex flex-col gap-1">
                <span className="text-sm font-semibold text-foreground">
                  {member.name}
                </span>
                <span className="text-xs text-foreground-muted">
                  {member.affiliation}
                </span>
              </div>
              <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
                {member.tag}
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
