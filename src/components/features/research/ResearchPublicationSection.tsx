/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:05 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:10:29
 */

import { ResearchSearchBar } from "./ResearchSearchBar";
import { ResearchStats } from "./ResearchStats";
import { FeaturedResearch } from "./FeaturedResearch";
import { JournalDirectory } from "./JournalDirectory";

export function ResearchPublicationSection() {
  return (
    <div className="flex flex-col gap-8">
      <ResearchSearchBar />
      <ResearchStats />
      <FeaturedResearch />
      <JournalDirectory />
    </div>
  );
}