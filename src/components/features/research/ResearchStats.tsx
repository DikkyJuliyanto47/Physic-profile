/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:53 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:06:53 
 */

import Link from "next/link";
import { RESEARCH_STATS, STAT_STRIP_IDS } from "./data";

export function ResearchStats() {
  const stats = STAT_STRIP_IDS
    .map((id) => RESEARCH_STATS.find((s) => s.id === id))
    .filter(Boolean);

  return (
    <div className="grid grid-cols-2 divide-x divide-y divide-primary-200 overflow-hidden rounded-md border border-primary-200 bg-primary-50 sm:grid-cols-4 sm:divide-y-0">
      {stats.map((stat) => (
        <Link
          key={stat!.id}
          href={stat!.href}
          className="flex items-center gap-2.5 px-5 py-4 transition-colors hover:bg-primary-100"
        >
          <i className={`fa-solid ${stat!.icon} text-sm text-primary-700`} aria-hidden="true" />
          <span className="text-sm font-medium text-primary-900">{stat!.title}</span>
        </Link>
      ))}
    </div>
  );
}