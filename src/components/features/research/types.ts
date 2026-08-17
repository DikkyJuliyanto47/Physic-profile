export type PublicationCategory = "BUKU" | "HKI" | "JURNAL" | "PROSIDING";

export interface Publication {
  id: string;
  category: PublicationCategory;
  title: string;
  meta: string[];
  href: string | null;
}

export interface PublicationFilter {
  id: "semua" | PublicationCategory;
  label: string;
}
