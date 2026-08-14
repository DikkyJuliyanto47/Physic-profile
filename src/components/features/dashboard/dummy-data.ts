/**
 * Dummy/static data untuk Admin Dashboard.
 *
 * Bentuk data mengikuti model di `prisma/schema.prisma` (News, Event, ContactMessage, dst).
 */

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

// 1. Ringkasan jumlah konten per domain.
export const contentSummary: ContentSummaryItem[] = [
  { label: "Berita", count: 24, href: "/admin/berita" },
  { label: "Agenda", count: 12, href: "/admin/agenda" },
  { label: "Anggota", count: 86, href: "/admin/anggota" },
  { label: "Perguruan Tinggi", count: 15, href: "/admin/perguruan-tinggi" },
  { label: "Publikasi", count: 40, href: "/admin/publikasi" },
  { label: "Galeri", count: 58, href: "/admin/galeri" },
];

// 2. Status hanya berlaku untuk model yang punya field ContentStatus di
// schema (News dan Event). Publication, DocumentResource, dan Gallery
export const statusSummary: StatusSummaryRow[] = [
  { status: "DRAFT", label: "Draft", news: 5, event: 2 },
  { status: "PUBLISHED", label: "Published", news: 17, event: 9 },
  { status: "ARCHIVED", label: "Archived", news: 2, event: 1 },
];

// 3. Berita terbaru (diurutkan dari yang paling baru dibuat).
export const recentNews: RecentNewsItem[] = [
  {
    id: "news-1",
    title: "PSI Surabaya Jadi Tuan Rumah Seminar Nasional Fisika Material",
    category: "SEMINAR",
    status: "PUBLISHED",
    createdAt: "2026-08-12",
  },
  {
    id: "news-2",
    title: "Kerja Sama Riset dengan Departemen Fisika ITS Resmi Ditandatangani",
    category: "KERJASAMA",
    status: "PUBLISHED",
    createdAt: "2026-08-10",
  },
  {
    id: "news-3",
    title: "Workshop Instrumentasi Sensor untuk Anggota Baru",
    category: "WORKSHOP",
    status: "DRAFT",
    createdAt: "2026-08-08",
  },
  {
    id: "news-4",
    title: "Anggota PSI Raih Penghargaan Publikasi Terbaik Tingkat Nasional",
    category: "PRESTASI_ANGGOTA",
    status: "PUBLISHED",
    createdAt: "2026-08-05",
  },
];

// 4. Agenda mendatang (startDate >= hari ini, diurutkan paling dekat).
export const upcomingAgenda: UpcomingAgendaItem[] = [
  {
    id: "event-1",
    title: "Kuliah Tamu: Fisika Komputasi dan Machine Learning",
    category: "KULIAH_TAMU",
    startDate: "2026-08-20",
    location: "Auditorium FMIPA Unesa",
  },
  {
    id: "event-2",
    title: "Webinar Nasional: Peran Fisika dalam Mitigasi Bencana",
    category: "WEBINAR",
    startDate: "2026-08-27",
    location: "Daring (Zoom)",
  },
  {
    id: "event-3",
    title: "Musyawarah Anggota Cabang Surabaya 2026",
    category: "MUSYAWARAH_ANGGOTA",
    startDate: "2026-09-05",
    location: "Gedung C9 Unesa",
  },
];

// 6. Informasi tambahan: pesan masuk yang belum dibaca (ContactMessage).
export const unreadMessages: RecentMessageItem[] = [
  {
    id: "msg-1",
    name: "Dr. Bambang Setiawan",
    subject: "Permintaan kerja sama seminar antar-cabang",
    createdAt: "2026-08-13",
  },
  {
    id: "msg-2",
    name: "Fitria Ramadhani",
    subject: "Pertanyaan pendaftaran anggota baru",
    createdAt: "2026-08-13",
  },
  {
    id: "msg-3",
    name: "Universitas Airlangga - Humas",
    subject: "Undangan kolaborasi riset instrumentasi",
    createdAt: "2026-08-11",
  },
];

export const unreadMessageCount = 5;