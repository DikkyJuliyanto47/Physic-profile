export type DocumentationType = "photo" | "video";

export interface DocumentationItem {
  id: string;
  type: DocumentationType;
  image: string;
  countLabel: string;
  date: string;
  title: string;
  location: string;
  href: string;
  description?: string | null;
  isFeatured?: boolean;
}
