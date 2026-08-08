/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:05 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:10:29
 */

import { Container, Section } from "@/components/ui";
import { ResearchSearchBar } from "./research-search-bar";
import { ResearchStats } from "./research-stats";
import { FeaturedResearch } from "./featured-research";
import { JournalDirectory } from "./journal-directory";
import { RecentPublications } from "./recent-publications";
import { ResearchCollaborationCta } from "./research-collaboration-cta";

export function ResearchPublicationSection() {
  return (
    <>
      <Section tone="default">
        <Container>
          <ResearchSearchBar />
          <div className="mt-8">
            <ResearchStats />
          </div>
        </Container>
      </Section>

      <Section tone="default">
        <Container>
          <FeaturedResearch />
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <JournalDirectory />
        </Container>
      </Section>

      <Section tone="default">
        <Container>
          <RecentPublications />
        </Container>
      </Section>

      <Section tone="default">
        <Container>
          <ResearchCollaborationCta />
        </Container>
      </Section>
    </>
  );
}