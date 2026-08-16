/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:04:10 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 11:04:51
 */

export const STAT_STRIP_IDS: ResearchStat["id"][] = [
  "kolaboratif",
  "buku",
  "hki",
  "jurnal",
];

export interface ResearchStat {
  id: string;
  icon: string;
  title: string;
  value: string;
  label: string;
  href: string;
}

export type ResearchStatus = "ongoing" | "completed";

export interface FeaturedResearch {
  id: string;
  year: number;
  status: ResearchStatus;
  title: string;
  description: string;
  leadResearcher: string;
  institutions: string;
  href: string;
  thumbnail: string;
}

export type JournalAffiliation = "psi" | "physics";

export interface Journal {
  id: string;
  name: string;
  shortName: string;
  issn: string;
  affiliation: JournalAffiliation;
  description: string;
  url: string;
}

export type PublicationCategory = "buku" | "hki" | "jurnal" | "prosiding";

export interface Publication {
  id: string;
  category: PublicationCategory;
  title: string;
  meta: string[];
  href: string;
}

export const RESEARCH_STATS: ResearchStat[] = [
  {
    id: "kolaboratif",
    icon: "fa-users",
    title: "Penelitian Kolaboratif",
    value: "24",
    label: "Proyek",
    href: "/riset-publikasi/penelitian",
  },
  {
    id: "buku",
    icon: "fa-book",
    title: "Buku",
    value: "18",
    label: "Buku",
    href: "/research-publication",
  },
  {
    id: "hki",
    icon: "fa-lightbulb",
    title: "HKI",
    value: "9",
    label: "Kekayaan Intelektual",
    href: "/research-publication",
  },
  {
    id: "jurnal",
    icon: "fa-file-lines",
    title: "Jurnal Ilmiah",
    value: "14",
    label: "Jurnal",
    href: "/riset-publikasi/jurnal",
  },
  {
    id: "prosiding",
    icon: "fa-layer-group",
    title: "Prosiding",
    value: "36",
    label: "Artikel",
    href: "/research-publication",
  },
];

export const FEATURED_RESEARCH: FeaturedResearch[] = [
  {
    id: "sensor-magnetik-iot",
    year: 2025,
    status: "ongoing",
    title: "Pengembangan Sensor Magnetik Berbasis IoT untuk Edukasi Fisika",
    description: "Penelitian pengembangan sensor medan magnet berbasis IoT untuk mendukung praktikum fisika modern.",
    leadResearcher: "Prof. Dr. Budi Santoso",
    institutions: "ITS, UNAIR, UNESA",
    href: "/riset-publikasi/penelitian/sensor-magnetik-iot",
    thumbnail: "/images/research/sensor-magnetik-iot.jpg",
  },
  {
    id: "material-nano-energi",
    year: 2024,
    status: "completed",
    title: "Material Fungsional Berbasis Nano untuk Energi Terbarukan",
    description: "Studi material fungsional berbasis nano untuk meningkatkan efisiensi perangkat energi terbarukan.",
    leadResearcher: "Dr. Rina Yuliana",
    institutions: "UNEJ, UPN Jatim",
    href: "/riset-publikasi/penelitian/material-nano-energi",
    thumbnail: "/images/research/material-nano-energi.jpg",
  },
  {
    id: "ai-fisika-partikel",
    year: 2025,
    status: "ongoing",
    title: "AI dalam Analisis Data Eksperimen Fisika Partikel",
    description: "Pemanfaatan machine learning untuk analisis data eksperimen pada fisika partikel berenergi tinggi.",
    leadResearcher: "Dr. Ahmad Faisal",
    institutions: "UKWMS, ITS",
    href: "/riset-publikasi/penelitian/ai-fisika-partikel",
    thumbnail: "/images/research/ai-fisika-partikel.jpg",
  },
];

export const JOURNALS: Journal[] = [
  {
    id: "jpfi",
    name: "Jurnal Pendidikan Fisika Indonesia",
    shortName: "JPFI",
    issn: "2460-9603",
    affiliation: "psi",
    description:
      "Jurnal nasional terakreditasi SINTA 3 yang menerbitkan artikel di bidang pendidikan fisika.",
    url: "https://journal.unnes.ac.id/nju/jpfi",
  },
  {
    id: "spj",
    name: "Surabaya Physics Journal",
    shortName: "SPJ",
    issn: "2797-2473",
    affiliation: "psi",
    description:
      "Jurnal ilmiah multidisiplin dalam bidang fisika dan aplikasinya.",
    url: "#",
  },
  {
    id: "jfi",
    name: "Jurnal Fisika Indonesia",
    shortName: "JFI",
    issn: "0852-1879",
    affiliation: "physics",
    description: "Jurnal terakreditasi SINTA 2 yang diterbitkan oleh PFI.",
    url: "#",
  },
  {
    id: "ijap",
    name: "Indonesian Journal of Applied Physics",
    shortName: "IJAP",
    issn: "2338-5483",
    affiliation: "physics",
    description:
      "Jurnal internasional yang fokus pada fisika terapan dan teknologi.",
    url: "#",
  },
];

export const PUBLICATIONS: Publication[] = [
  {
    id: "fisika-material-modern",
    category: "buku",
    title: "Fisika Material Modern",
    meta: ["Penulis: Dr. Budi Santoso", "2025"],
    href: "/research-publication",
  },
  {
    id: "alat-ukur-medan-magnet",
    category: "hki",
    title: "Alat Ukur Medan Magnet Berbasis IoT",
    meta: ["No. ID/0000/123456", "2025"],
    href: "/research-publication",
  },
  {
    id: "thin-film-properties",
    category: "jurnal",
    title: "Analysis of Thin Film Properties Using XRD",
    meta: ["Surabaya Physics Journal", "Vol. 8 No. 1 (2025)"],
    href: "/research-publication",
  },
  {
    id: "icsp-2024",
    category: "prosiding",
    title: "Proceedings of the 2nd Surabaya Physics Symposium",
    meta: ["ICSP 2024", "2024"],
    href: "/research-publication",
  },
  {
    id: "physics-ar",
    category: "jurnal",
    title: "Physics Learning with Augmented Reality",
    meta: ["JPFI Vol. 7 No. 2 (2024)"],
    href: "/research-publication",
  },
];

export const PUBLICATION_FILTERS: { id: "semua" | PublicationCategory; label: string }[] = [
  { id: "semua", label: "Semua" },
  { id: "buku", label: "Buku" },
  { id: "hki", label: "HKI" },
  { id: "jurnal", label: "Jurnal" },
  { id: "prosiding", label: "Prosiding" },
];
