import "server-only";

import { PublicationType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import type { Publication, PublicationFilter } from "./types";

export const PUBLICATION_FILTERS: PublicationFilter[] = [
  { id: "semua", label: "Semua" },
  { id: PublicationType.BUKU, label: "Buku" },
  { id: PublicationType.HKI, label: "HKI" },
  { id: PublicationType.JURNAL, label: "Jurnal" },
  { id: PublicationType.PROSIDING, label: "Prosiding" },
];

function formatPublishedAt(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", { year: "numeric" }).format(date);
}

export async function getPublishedPublications(): Promise<Publication[]> {
  const publications = await prisma.publication.findMany({
    where: { publishedAt: { not: null, lte: new Date() } },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  return publications.map((publication) => ({
    id: publication.id,
    category: publication.type,
    title: publication.title,
    meta: [
      publication.description,
      publication.publishedAt ? formatPublishedAt(publication.publishedAt) : null,
    ].filter((item): item is string => Boolean(item)),
    href: publication.externalUrl ?? publication.fileUrl,
  }));
}
