/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:05 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:10:29
 */

import { Container, Section } from "@/components/ui";
import { ResearchSearchBar } from "./ResearchSearchBar";
import { ResearchStats } from "./ResearchStats";
import { FeaturedResearch } from "./FeaturedResearch";
import { JournalDirectory } from "./JournalDirectory";
import { RecentPublications } from "./RecentPublications";
import { ResearchCollaborationCta } from "./ResearchCollaborationCta";

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