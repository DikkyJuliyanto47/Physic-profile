export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string | null;
  image?: string;
  href: string;
}