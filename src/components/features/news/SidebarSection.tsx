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
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-primary-950">
          {title}
        </h2>

        {action && (
          <Link
            href={action.href}
            className="shrink-0 text-xs font-medium text-foreground-muted transition-colors hover:text-primary-600"
          >
            {action.label} →
          </Link>
        )}
      </div>

      <div className="pt-5">{children}</div>
    </section>
  );
}