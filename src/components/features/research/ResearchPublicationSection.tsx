import { RecentPublications } from "./RecentPublications";

import type { Publication } from "./types";

interface ResearchPublicationSectionProps {
  publications: Publication[];
}

export function ResearchPublicationSection({
  publications,
}: ResearchPublicationSectionProps) {
  return <RecentPublications publications={publications} />;
}