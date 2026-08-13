/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:07:23 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:07:23 
 */

import Image from "next/image";
import Link from "next/link";
import { Badge, SectionHeading } from "@/components/ui";
import { FEATURED_RESEARCH, type ResearchStatus } from "./data";

const STATUS_LABEL: Record<ResearchStatus, string> = { ongoing: "On Going", completed: "Completed" };
const STATUS_TONE: Record<ResearchStatus, "primary" | "neutral"> = { ongoing: "primary", completed: "neutral" };

export function FeaturedResearch() {
  const [primary, ...secondary] = FEATURED_RESEARCH;

  return (
    <div>
      <SectionHeading
        title="Penelitian Unggulan"
        action={
          <Link href="/riset-publikasi/penelitian" className="text-sm font-medium text-primary-600 hover:text-primary-700">
            Lihat Penelitian Lainnya
            <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
          </Link>
        }
      />

      <div className="mt-6 overflow-hidden rounded-lg border border-border">
        <div className="grid sm:grid-cols-[minmax(0,220px)_1fr]">
          <div className="relative aspect-4/3 sm:aspect-auto">
            <Image
              src={primary.thumbnail}
              alt={primary.title}
              fill
              sizes="220px"
              className="object-cover"
            />
          </div>
          <div className="border-t border-border p-5 sm:border-l sm:border-t-0">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-medium text-primary-600">{primary.year}</span>
              <Badge tone={STATUS_TONE[primary.status]}>{STATUS_LABEL[primary.status]}</Badge>
            </div>
            <h3 className="mt-2 text-lg font-semibold leading-snug text-foreground">{primary.title}</h3>
            <p className="mt-2 text-sm text-foreground-muted">{primary.description}</p>
            <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs text-foreground-muted">
              <span><span className="text-foreground">Ketua Peneliti:</span> {primary.leadResearcher}</span>
              <span><span className="text-foreground">Institusi:</span> {primary.institutions}</span>
            </div>
            <Link href={primary.href} className="mt-3 inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
              Lihat detail
              <i className="fa-solid fa-arrow-right ml-2" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="divide-y divide-border border-t border-border">
          {secondary.slice(0, 2).map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm">
                <Image src={item.thumbnail} alt={item.title} fill sizes="64px" className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-medium text-primary-600">{item.year}</span>
                  <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                </div>
                <h4 className="mt-1 text-sm font-semibold leading-snug text-foreground">{item.title}</h4>
                <p className="mt-1 text-xs text-foreground-muted">{item.leadResearcher} · {item.institutions}</p>
              </div>
              <Link href={item.href} className="shrink-0 text-xs font-medium text-primary-600 hover:text-primary-700">
                Detail →
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}