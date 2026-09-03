// Data untuk Gallery
export interface GalleryItem {
  id: string;
  date: string;
  title?: string;
  caption: string;
  image?: string;
  href?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    date: "24 November 2026",
    title: "Pertemuan Rutin PSI",
    caption: "Pertemuan Rutin PSI (Physical Society of Indonesia) Cabang Surabaya",
    href: "/gallery",
    image: "/assets/gallery/pertemuan-07-27-01.jpeg"
  },
  {
    id: "gallery-2",
    date: "24 November 2026",
    title: "Pertemuan Rutin PSI",
    caption: "Pertemuan Rutin PSI (Physical Society of Indonesia) Cabang Surabaya",
    href: "/gallery",
    image: "/assets/gallery/pertemuan-07-27-02.jpeg"
  },
  {
    id: "gallery-3",
    date: "24 November 2026",
    title: "Pertemuan Rutin PSI",
    caption: "Pertemuan Rutin PSI (Physical Society of Indonesia) Cabang Surabaya",
    href: "/gallery",
    image: "/assets/gallery/pertemuan-07-27-03.jpeg"
  },
];

// Data About
export interface AboutItem {
  id: string;
  image?: string;
  href?: string;
}

export const aboutItems: AboutItem[] = [
  {
    id: "about-1",
    href: "/about",
    image: "/assets/about/anggota-psi.jpeg"
  }
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

