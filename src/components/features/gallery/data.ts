/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 08:11:42 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-09 08:28:53
 */

export interface GalleryStats {
    totalPhotos: number;
    totalVideos: number;
};

export const galleryStats: GalleryStats = {
    totalPhotos: 48,
    totalVideos: 12,
};

export type DocumentationType = "photo" | "video";

export interface DocumentationItem {
    id: string;
    type: DocumentationType;
    countLabel: string;
    date: string;
    title: string;
    location: string;
    href: string;
}

export const documentationItems: DocumentationItem[] = [
  {
    id: "doc-1",
    type: "photo",
    countLabel: "12 Foto",
    date: "27 Juli 2026",
    title: "Lorem Ipsum Dolor Sit Amet",
    location: "Surabaya",
    href: "/galeri",
  },
  {
    id: "doc-2",
    type: "video",
    countLabel: "18:42",
    date: "14 Juni 2026",
    title: "Lorem Ipsum Dolor Sit Amet",
    location: "Surabaya",
    href: "/galeri",
  },
  {
    id: "doc-3",
    type: "photo",
    countLabel: "9 Foto",
    date: "02 Mei 2026",
    title: "Lorem Ipsum Dolor Sit Amet",
    location: "Surabaya",
    href: "/galeri",
  },
  {
    id: "doc-4",
    type: "photo",
    countLabel: "15 Foto",
    date: "20 April 2026",
    title: "Lorem Ipsum Dolor Sit Amet",
    location: "Sidoarjo",
    href: "/galeri",
  },
  {
    id: "doc-5",
    type: "video",
    countLabel: "09:15",
    date: "11 Maret 2026",
    title: "Lorem Ipsum Dolor Sit Amet",
    location: "Surabaya",
    href: "/galeri",
  },
  {
    id: "doc-6",
    type: "photo",
    countLabel: "20 Foto",
    date: "25 Januari 2026",
    title: "Lorem Ipsum Dolor Sit Amet",
    location: "Malang",
    href: "/galeri",
  },
];

export interface GalleryCategory {
    id: string;
    name: string;
    albumCount: number;
    photoCount: number;
    videoCount: number;
};

export const galleryCategories: GalleryCategory[] = [
   { id: "category-1", name: "Seminar & Konferensi", albumCount: 6, photoCount: 24, videoCount: 4 },
  { id: "category-2", name: "Workshop & Pelatihan", albumCount: 5, photoCount: 18, videoCount: 3 },
  { id: "category-3", name: "Pertemuan & Rapat", albumCount: 4, photoCount: 16, videoCount: 2 },
  { id: "category-4", name: "Pengabdian Masyarakat", albumCount: 3, photoCount: 12, videoCount: 1 },
];
