/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 07:43:24 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 10:00:00
 */

export interface HeroImage {
  id: string;
  src: string;
  alt: string;
}

export const heroImages: HeroImage[] = [
  {
    id: "hero-1",
    src: "/assets/hero/pertemuan-07-27-01.jpeg",
    alt: "Pertemuan Rutin PSI (Physical Society of Indonesia) Cabang Surabaya",
  },
  {
    id: "hero-2",
    src: "/assets/hero/pertemuan-07-27-02.jpeg",
    alt: "Pertemuan Rutin PSI (Physical Society of Indonesia) Cabang Surabaya",
  },
  {
    id: "hero-3",
    src: "/assets/hero/pertemuan-07-27-02.jpeg",
    alt: "Pertemuan Rutin PSI (Physical Society of Indonesia) Cabang Surabaya",
  },
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

// Data untuk Agenda
export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  description?: string;
  image?: string;
  views?: number;
  href?: string;
}

export const upcomingAgenda: AgendaItem[] = [
  {
    id: "agenda-1",
    title: "Penyelerasan Kurikulum: Asesmen OBE",
    date: "29 Juli 2025",
    time: "09.30 - 12.30 WIB",
    location: "Ruang Meeting Rumpun Fisika, Gedung C3 Lantai 1, Universitas Negeri Surabaya",
    description:
      "Pertemuan rutin anggota Physical Society of Indonesia (PSI) Cabang Surabaya.",
    image: "/assets/activity/penyelarasan-kurikulum.jpeg",
    views: 10,
    href: "/agenda",
  },
  {
    id: "agenda-2",
    title: "Pertemuan Rutin PSI",
    date: "24 November 2025",
    time: "09.30 - 12.30 WIB",
    location: "Universitas Airlangga",
    description:
      "Pertemuan rutin anggota Physical Society of Indonesia (PSI) Cabang Surabaya.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    views: 10,
    href: "/agenda",
  },
];

// Data untuk Universitas
export interface University {
  id: string;
  name: string;
  logo: string;
  href?: string;
}

export const universities: University[] = [
  {
    id: "unesa",
    name: "Universitas Negeri Surabaya",
    logo: "/assets/logo/universitas/unesa.png",
  },
  {
    id: "unair",
    name: "Universitas Airlangga",
    logo: "/assets/logo/universitas/unair.png",
  },
  {
    id: "its",
    name: "Institut Teknologi Sepuluh Nopember",
    logo: "/assets/logo/universitas/its.webp",
  },
  {
    id: "upn-jatim",
    name: "UPN Veteran Jawa Timur",
    logo: "/assets/logo/universitas/upnvjt.png",
  },
  {
    id: "ukwm-surabaya",
    name: "Universitas Katolik Widya Mandala Surabaya",
    logo: "/assets/logo/universitas/ukwms.png",
  },
  {
    id: "unej",
    name: "Universitas Jember",
    logo: "/assets/logo/universitas/unej.png",
  },
  {
    id: "uim",
    name: "Universitas Islam Madura",
    logo: "/assets/logo/universitas/uim.png",
  },
  {
    id: "unbilf",
    name: "Universitas Bilfath",
    logo: "/assets/logo/universitas/ubilf.png",
  },
  {
    id: "unu-pasuruan",
    name: "Universitas NU Pasuruan",
    logo: "/assets/logo/universitas/unup.png",
  },
];
