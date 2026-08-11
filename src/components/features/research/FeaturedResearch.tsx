/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:07:23 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:07:23 
 */

import Link from "next/link";
import { Badge, Card, SectionHeading } from "@/components/ui";
import { FEATURED_RESEARCH, type ResearchStatus } from "./data";

const STATUS_LABEL: Record<ResearchStatus, string> = {
  ongoing: "On Going",
  completed: "Completed",
};

const STATUS_TONE: Record<ResearchStatus, "primary" | "neutral"> = {
  ongoing: "primary",
  completed: "neutral",
};

export function FeaturedResearch() {
  return (
    <div>
      <SectionHeading
        title="Penelitian Unggulan"
        action={
          <Link
            href="/riset-publikasi/penelitian"
            className="text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            Lihat semua penelitian
            <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {FEATURED_RESEARCH.map((item) => (
          <Card key={item.id} className="flex h-full flex-col p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground-muted">{item.year}</span>
              <Badge tone={STATUS_TONE[item.status]}>
                {STATUS_LABEL[item.status]}
              </Badge>
            </div>

            <h3 className="mt-3 text-lg font-semibold leading-snug text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-sm text-foreground-muted">
              {item.description}
            </p>

            <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-500"
                aria-hidden="true"
              >
                <i className="fa-solid fa-user" />
              </span>
              <div className="text-sm">
                <p className="text-foreground-muted">Ketua Peneliti</p>
                <p className="font-medium text-foreground">
                  {item.leadResearcher}
                </p>
              </div>
              <div className="ml-auto text-right text-sm">
                <p className="text-foreground-muted">Institusi</p>
                <p className="font-medium text-foreground">
                  {item.institutions}
                </p>
              </div>
            </div>

            <Link
              href={item.href}
              className="mt-4 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Lihat Detail
              <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}