/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:05 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:10:29
 */

import { RecentPublications } from "./RecentPublications";
import { PUBLICATION_FILTERS } from "./data";
import type { Publication } from "./types";

export function ResearchPublicationSection({ publications }: { publications: Publication[] }) {
  return (
    <div className="flex flex-col gap-8">
      <RecentPublications
        publications={publications}
        filters={PUBLICATION_FILTERS}
      />
    </div>
  );
}
