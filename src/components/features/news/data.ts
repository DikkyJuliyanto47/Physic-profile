/*
 * @Author: galhkoernia
 * @Date: 2026-08-13 13:00:00
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 13:00:00
 */

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  href: string;
}

export const latestNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Penyelarasan Kurikulum: Asesmen OBE",
    date: "29 Juli 2025",
    excerpt:
      "Pertemuan rutin anggota Physical Society of Indonesia (PSI) Cabang Surabaya",
    image: "/assets/activity/penyelarasan-kurikulum.jpeg",
    href: "/berita",
  },
  {
    id: "news-2",
    title: "Pertemuan Rutin Anggota PSI Cabang Surabaya",
    date: "24 November 2025",
    excerpt:
      "Pertemuan rutin anggota Physical Society of Indonesia (PSI) Cabang Surabaya",
    image: "/assets/hero/pertemuan-07-27-01.jpeg",
    href: "/berita",
  },
];