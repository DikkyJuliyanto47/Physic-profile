export type PublicationStatus = "BUKU" | "HKI" | "JURNAL" | "PROSIDING";

export interface Publication {
  id: string;
  category: string;
  title: string;
  meta: string[];
  href: string | null;
}

export interface PublicationFilter {
  id: "semua" | PublicationStatus;
  label: string;
}
