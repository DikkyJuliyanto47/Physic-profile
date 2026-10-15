export type PublicationType = "JURNAL" | "BUKU" | "HKI" | "PROSIDING";

export type PublicationInput = {
  contentVersion?: number;
  intent?: "draft" | "publish";
  title: string;
  type: PublicationType;
  description?: string;
  externalUrl?: string;
  publishedAt?: string;
};
