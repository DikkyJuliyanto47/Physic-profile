/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:53 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:06:53 
 */

import Link from "next/link";
import { Card } from "@/components/ui";
import { RESEARCH_STATS } from "./data";

export function ResearchStats() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {RESEARCH_STATS.map((stat) => (
        <Link key={stat.id} href={stat.href} className="group block">
          <Card className="flex h-full flex-col justify-between p-5 transition-shadow group-hover:shadow-elevated">
            <div className="flex items-start justify-between">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary-50 text-primary-600">
                <i className={`fa-solid ${stat.icon}`} aria-hidden="true" />
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-foreground">{stat.title}</p>
              <div className="mt-1 flex items-end justify-between">
                <p>
                  <span className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </span>{" "}
                  <span className="text-sm text-foreground-muted">
                    {stat.label}
                  </span>
                </p>
                <i
                  className="fa-solid fa-arrow-right text-primary-600 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}