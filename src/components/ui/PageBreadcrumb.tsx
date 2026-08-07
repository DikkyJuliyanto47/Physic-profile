/*
 * @Author: galhkoernia 
 * @Date: 2026-08-07 22:37:49 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 22:49:19
*/

import Link from "next/link";
import { Fragment } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-2 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 && (
                <li
                  aria-hidden="true"
                  className="text-neutral-400"
                >
                  /
                </li>
              )}

              <li>
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-foreground-muted transition-colors hover:text-primary-600"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current="page"
                    className="font-medium text-primary-600"
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}