/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 07:43:24 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 07:46:17
 */


// PlaceHolder data LandingPage

// Data untuk Berita
export interface NewsItem {
    id: string;
    date: string;
    excerpt: string;
    href: string;
}

export const latestNews: NewsItem[] = [
    {
        id: "news-1",
        date: "27 Juli 2026",
        excerpt: "Dolor sit amet, consectetur adipiscing elit.",
        href: "/berita",
    },
     {
        id: "news-2",
        date: "27 Juli 2026",
        excerpt: "Dolor sit amet, consectetur adipiscing elit.",
        href: "/berita",
    },
];

// Data untuk About
export interface AboutHighlight {
  id: string;
  title: string;
  description: string;
}

export const aboutHighlights: AboutHighlight[] = [
  { id: "highlight-1", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "highlight-2", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "highlight-3", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
];

// Data untuk Statistic
export interface Statistic {
  id: string;
  value: string;
  label: string;
}

export const statistics: Statistic[] = [
  { id: "stat-members", value: "99+", label: "Anggota Aktif" },
  { id: "stat-universities", value: "10", label: "Perguruan Tinggi" },
  { id: "stat-activities", value: "30", label: "Kegiatan" },
];


// Data untuk Gallery
export interface GalleryItem {
  id: string;
  date: string;
  caption: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    date: "27 Juli 2026",
    caption: "Dolor sit amet, consectetur adipiscing elit.",
  },
];

// Data untuk Agenda
export interface AgendaItem {
  id: string;
}

export const upcomingAgenda: AgendaItem[] = [
  { id: "agenda-1" },
  { id: "agenda-2" },
  { id: "agenda-3" },
];

// Data untuk Member
export interface Member {
  id: string;
  name: string;
  affiliation: string;
  tag: string;
}

export const members: Member[] = Array.from({ length: 5 }, (_, index) => ({
  id: `member-${index + 1}`,
  name: "Lorem Ipsum",
  affiliation: "Dolor sit amet, consectetur adipiscing.",
  tag: "Lorem Ipsum",
}));


// Data untuk Universitas
export interface UniversityPlaceholder {
  id: string;
  tone: "light" | "solid";
}

export const universities: UniversityPlaceholder[] = [
  { id: "university-1", tone: "light" },
  { id: "university-2", tone: "solid" },
  { id: "university-3", tone: "light" },
];
