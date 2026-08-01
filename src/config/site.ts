/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 21:07:02 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 21:18:31
 */

import type { NavItem, SocialLink } from "@/types";

export const siteConfig = {
  name: "Physical Society of Indonesia - Cabang Surabaya",
  shortName: "PSI Surabaya",
  description:
    "Wadah kolaborasi akademisi, peneliti, dan pendidik fisika dari perguruan tinggi di wilayah Surabaya untuk pengembangan keilmuan, pendidikan, dan penelitian fisika.",
};

export const publicNav: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Tentang Kami", href: "/tentang" },
  { label: "Kegiatan", href: "/kegiatan" },
  { label: "Kepengurusan", href: "/kepengurusan" },
  { label: "Anggota", href: "/anggota" },
  { label: "Akademik", href: "/akademik" },
  { label: "Riset & Publikasi", href: "/riset-publikasi" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

export const footerNav: Record<"tentang" | "jelajahi", NavItem[]> = {
  tentang: [
    { label: "Sejarah PSI", href: "/tentang" },
    { label: "Visi & Misi", href: "/tentang" },
    { label: "Kepengurusan", href: "kepengurusan" },
  ],
  jelajahi: [
    { label: "Direktori Anggota", href: "/anggota" },
    { label: "Perguruan Tinggi", href: "/perguruan-tinggi" },
    { label: "Berita & Agenda", href: "/berita" },
  ],
};


export const socialLinks: SocialLink[] = [
  { label: "Threads", href: "/#", icon: "fa-brands fa-threads" },
  { label: "Instagram", href: "/#", icon: "fa-brands fa-instagram" },
  { label: "YouTube", href: "/#", icon: "fa-brands fa-youtube" },
  { label: "X", href: "/#", icon: "fa-brands fa-twitter" },
];
