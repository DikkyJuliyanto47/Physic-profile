/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 07:43:24 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 09:12:38
 */

// PlaceHolder data LandingPage

export interface HeroImage {
  id: string;
  src: string;
  alt: string;
}

export const heroImages: HeroImage[] = [
  {
    id: "hero-1",
    src: "/assets/landing/hero-community.jpg",
    alt: "Kegiatan komunitas Physical Society of Indonesia Surabaya",
  },
  {
    id: "hero-2",
    src: "/assets/landing/pkm-prodi-pendidikan.jpg",
    alt: "Kegiatan komunitas Physical Society of Indonesia Surabaya",
  },
  {
    id: "hero-3",
    src: "/assets/landing/hero-community.jpg",
    alt: "Kegiatan komunitas Physical Society of Indonesia Surabaya",
  },
];

// Data untuk Berita
export interface NewsItem {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  href: string;
}

export const latestNews: NewsItem[] = [
  {
    id: "news-1",
    title: "Seminar Nasional Fisika Terapan",
    date: "12 Agustus 2026",
    excerpt:
      "Informasi dan persiapan kegiatan Seminar Nasional Fisika Terapan yang akan diselenggarakan bersama komunitas fisika.",
    href: "/berita",
  },
  {
    id: "news-2",
    title: "Workshop Instrumentasi Laboratorium",
    date: "20 Agustus 2026",
    excerpt:
      "Kegiatan workshop instrumentasi laboratorium sebagai ruang berbagi pengetahuan dan pengalaman di bidang fisika.",
    href: "/berita",
  },
  {
    id: "news-3",
    title: "Diskusi Ilmiah Riset Material Maju",
    date: "5 September 2026",
    excerpt:
      "Diskusi ilmiah mengenai perkembangan riset material maju dan kontribusinya terhadap perkembangan ilmu fisika.",
    href: "/berita",
  },
];

// Data untuk About
export interface AboutHighlight {
  id: string;
  title: string;
  description: string;
}

export interface AboutHighlight {
  id: string;
  title: string;
  description: string;
}

export interface GalleryImage {
  id: number;
  label: string;
}

export const aboutHighlights: AboutHighlight[] = [
  { id: "highlight-1", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "highlight-2", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
  { id: "highlight-3", title: "Lorem Ipsum", description: "Lorem ipsum dolor sit amet, consectetur." },
];

export const galleryImages: GalleryImage[] = [
  { id: 1, label: "Gambar 1" },
  { id: 2, label: "Gambar 2" },
  { id: 3, label: "Gambar 3" },
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
  image?: string;
  href?: string;
}

export const galleryItems: GalleryItem[] = [
  {
    id: "gallery-1",
    date: "27 Juli 2026",
    caption: "Dolor sit amet, consectetur adipiscing elit.",
    href: "/gallery",
  },
  {
    id: "gallery-2",
    date: "27 Juli 2026",
    caption: "Dolor sit amet, consectetur adipiscing elit.",
    href: "/gallery",
  },
  {
    id: "gallery-3",
    date: "27 Juli 2026",
    caption: "Dolor sit amet, consectetur adipiscing elit.",
    href: "/gallery",
  },
];

// Data untuk Agenda
export interface AgendaItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  image?: string;
  href?: string;
}

export const upcomingAgenda: AgendaItem[] = [
  {
    id: "agenda-1",
    title: "Seminar Nasional Fisika Terapan",
    date: "12 Agustus 2026",
    time: "09.00 WIB",
    location: "Universitas Negeri Surabaya",
    href: "/kegiatan",
  },
  {
    id: "agenda-2",
    title: "Workshop Instrumentasi Laboratorium",
    date: "20 Agustus 2026",
    time: "13.00 WIB",
    location: "Institut Teknologi Sepuluh Nopember",
    href: "/kegiatan",
  },
  {
    id: "agenda-3",
    title: "Diskusi Ilmiah Riset Material Maju",
    date: "5 September 2026",
    time: "10.00 WIB",
    location: "Universitas Jember",
    href: "/kegiatan",
  },
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