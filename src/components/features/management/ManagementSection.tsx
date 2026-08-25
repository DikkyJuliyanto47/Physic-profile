import Image from "next/image";
import type { ManagementGroup } from "./data";

interface ManagementSectionProps {
  groups: ManagementGroup[];
}

export function ManagementSection({ groups }: ManagementSectionProps) {
  if (groups.length === 0) {
    return (
      <div className="border-y border-neutral-200 py-10 text-sm text-foreground-muted">
        Belum ada data kepengurusan aktif.
      </div>
    );
  }

  return (
    <div>
      {groups.map((group) => (
        <section
          id={group.id}
          key={group.id}
          className="scroll-mt-28 border-t border-neutral-200 py-10 first:border-t-0 first:pt-0 lg:py-12"
        >
          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {group.members.map((member) => (
              <article key={member.id} className="flex items-center gap-5">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-full bg-neutral-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug text-foreground">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-primary-700">
                    {member.role}
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
  );
}