/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 21:07:02 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 10:09:16
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
  { label: "Tentang Kami", href: "/about" },
  { label: "Kepengurusan", href: "/managements" },
  { label: "Anggota", href: "/members" },
  { label: "Riset & Publikasi", href: "/research-publication" },
  { label: "Galeri", href: "/gallery" },
];

export const footerNav: Record<"about" | "jelajahi", NavItem[]> = {
  about: [
    { label: "Sejarah PSI", href: "/about" },
    { label: "Visi & Misi", href: "/about" },
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
