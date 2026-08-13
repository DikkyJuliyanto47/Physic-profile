/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 13:00:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 13:00:00
 */

import type { ReactNode } from "react";
import Link from "next/link";

interface SidebarSectionProps {
  title: string;
  action?: {
    label: string;
    href: string;
  };
  children: ReactNode;
}

export function SidebarSection({ title, action, children }: SidebarSectionProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">
          {title}
        </h3>

        {action && (
          <Link
            href={action.href}
            className="text-xs font-semibold text-primary-600 hover:text-primary-700"
          >
            {action.label} →
          </Link>
        )}
      </div>

      {children}
    </div>
  );
}