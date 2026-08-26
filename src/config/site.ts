import type { NavItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "Physical Society of Indonesia - Cabang Surabaya",
  shortName: "PSI Surabaya",
  description: "Wadah kolaborasi akademisi, peneliti, dan pendidik fisika dari perguruan tinggi di wilayah Surabaya untuk pengembangan keilmuan, pendidikan, dan penelitian fisika.",
};

export const publicNav: NavItem[] = [
  { label: "Beranda", href: "/" },
  {
    label: "Tentang Kami",
    children: [
      { label: "Profil Singkat", href: "/about#profil" },
      { label: "Sejarah PSI", href: "/about#sejarah" },
      { label: "Visi & Misi", href: "/about#visi-misi" }
    ],
  },
  {
    label: "Kepengurusan",
    children: [
      { label: "Struktur Kepengurusan", href: "/managements" },
      { label: "Periode Kepengurusan", href: "/managements#periode" },
    ],
  },
  {
    label: "Anggota",
    children: [
      { label: "Direktori Anggota", href: "/members" },
      { label: "Perguruan Tinggi", href: "/universities" }
    ],
  },
  {
    label: "Riset & Publikasi",
    children: [
      { label: "Riset", href: "/research-publication#research" },
      { label: "Publikasi", href: "/research-publication#publication" },
      { label: "Buku", href: "/research-publication#book"},
      { label: "HKI", href: "/research-publication#hki"},
    ],
  },
  { label: "Galeri", href: "/gallery",
    children: [
      { label: "Foto", href: "/gallery#photos"},
      { label: "Vidio", href: "/gallery#videos"},

    ]
   },
];

export const footerNav: Record<"about" | "jelajahi", NavItem[]> = {
  about: [
    { label: "Sejarah PSI", href: "/about#sejarah" },
    { label: "Visi & Misi", href: "/about#visi-misi" },
    { label: "Kepengurusan", href: "/managements" },
  ],
  jelajahi: [
    { label: "Direktori Anggota", href: "/members" },
    { label: "Perguruan Tinggi", href: "/universities" },
    { label: "Berita & Agenda", href: "/news" },
  ],
};

export const socialLinks: SocialLink[] = [
  { label: "Threads", href: "/#", icon: "fa-brands fa-threads" },
  { label: "Instagram", href: "/#", icon: "fa-brands fa-instagram" },
  { label: "YouTube", href: "/#", icon: "fa-brands fa-youtube" },
  { label: "X", href: "/#", icon: "fa-brands fa-twitter" },
];