export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface ContentSummaryItem {
  label: string;
  count: number;
  href: string;
}

export interface StatusSummaryRow {
  status: ContentStatus;
  label: string;
  news: number;
  event: number;
}

export interface RecentNewsItem {
  id: string;
  title: string;
  category: string;
  status: ContentStatus;
  createdAt: string;
}

export interface UpcomingAgendaItem {
  id: string;
  title: string;
  category: string;
  startDate: string;
  location: string;
}

export interface RecentMessageItem {
  id: string;
  name: string;
  subject: string;
  createdAt: string;
}
