import { prisma } from "@/lib/prisma";
import { RecentPublications } from "./RecentPublications";
import type { Publication, PublicationStatus } from "./types";

function toPublicationStatus(type: string): PublicationStatus {
  switch (type) {
    case "BUKU":
    case "HKI":
    case "JURNAL":
    case "PROSIDING":
      return type;
    default:
      throw new Error(`Invalid publication type: ${type}`);
  }
}

export async function ResearchPublicationSection() {
  const publications = await prisma.publication.findMany({
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const data: Publication[] = publications.map((publication) => ({
    id: publication.id,
    title: publication.title,
    category: toPublicationStatus(publication.type),
    meta: publication.publishedAt
      ? [String(publication.publishedAt.getFullYear())]
      : [],
    href: publication.externalUrl,
  }));

  return <RecentPublications publications={data} />;
}