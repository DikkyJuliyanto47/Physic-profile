export const publishedContent = {
  status: "PUBLISHED",
  reviewStatus: "APPROVED",
} as const;

export function publishedPublications(now = new Date()) {
  return {
    status: "PUBLISHED" as const,
    reviewStatus: "APPROVED" as const,
    publishedAt: { not: null, lte: now },
  };
}
