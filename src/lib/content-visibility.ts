export const publishedContent = { status: "PUBLISHED" } as const;

export function publishedPublications(now = new Date()) {
  return { publishedAt: { not: null, lte: now } };
}
