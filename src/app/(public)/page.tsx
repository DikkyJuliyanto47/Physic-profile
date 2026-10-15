import { publishedContent } from "@/lib/content-visibility";
import { publicMetadata } from "@/config/seo";
import {
  AboutSection,
  EventsSection,
  GallerySection,
  JoinCtaSection,
  LatestNewsPanel,
  StatisticsSection,
  UniversitiesSection,
} from "@/components/features/home";

import { prisma } from "@/lib/prisma";
import { seoConfig } from "@/config/seo";
import { JsonLd } from "@/components/seo/JsonLd";

export const metadata = publicMetadata("Physical Society of Indonesia (PSI) Cabang Surabaya", "Website resmi Physical Society of Indonesia Cabang Surabaya yang menyediakan informasi organisasi, kegiatan ilmiah, berita, riset, publikasi, dan jejaring komunitas fisika.", "/");

export default async function Page() {
  const [events, universities] = await Promise.all([
    prisma.event.findMany({
      where: {
        ...publishedContent,
      },
      orderBy: {
        startDate: "desc",
      },
      take: 3,
      select: {
        id: true,
        slug: true,
        title: true,
        description: true,
        startDate: true,
        location: true,
      },
    }),
    prisma.university.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        logoUrl: true,
        deptUrl: true,
        websiteUrl: true,
      },
    }),
  ]);

  return (
    <>
      <h1 className="sr-only">Physical Society of Indonesia (PSI) Cabang Surabaya</h1>
      {seoConfig.siteUrl && <JsonLd data={{
        "@context": "https://schema.org", "@type": "WebSite",
        "@id": `${seoConfig.siteUrl}/#website`, url: seoConfig.siteUrl,
        name: seoConfig.siteName, description: seoConfig.siteDescription,
        publisher: { "@id": `${seoConfig.siteUrl}/#organization` },
      }} />}
      <GallerySection />
      <AboutSection />
      <StatisticsSection />

      <LatestNewsPanel />
      <EventsSection events={events} />

      <UniversitiesSection universities={universities} />

      <JoinCtaSection />
    </>
  );
}
