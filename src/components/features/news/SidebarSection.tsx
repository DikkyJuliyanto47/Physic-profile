import Link from "next/link";
import type { ReactNode } from "react";

interface SidebarSectionProps {
  title: string;
  action?: {
    label: string;
    href: string;
  };
  children: ReactNode;
}

export function SidebarSection({
  title,
  action,
  children,
}: SidebarSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-primary-950">
          {title}
        </h2>

        {action && (
          <Link
            href={action.href}
            className="text-xs font-semibold text-primary-700 transition-colors hover:text-primary-900"
          >
            {action.label} →
          </Link>
        )}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}