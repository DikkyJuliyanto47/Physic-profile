import { RecentPublications } from "./RecentPublications";
import type { Publication } from "./types";

export function ResearchPublicationSection({ publications }: { publications: Publication[] }) {
  return <RecentPublications publications={publications} />;
}
