
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
