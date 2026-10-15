export type PublicationType = "JURNAL" | "BUKU" | "HKI" | "PROSIDING";

export type PublicationInput = {
  title: string;
  type: PublicationType;
  description?: string;
  externalUrl?: string;
  publishedAt?: string;
};
