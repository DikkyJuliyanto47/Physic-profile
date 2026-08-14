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


export type DocumentationType = "photo" | "video";

export interface DocumentationItem {
  id: string;
  type: "photo" | "video";
  image: string;
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
    image: "/assets/gallery/pertemuan-07-27-01.jpeg",
    countLabel: "1 Foto",
    date: "27 Juli 2025",
    title: "Pertemuan Rutin PSI Cabang Surabaya",
    location: "Surabaya",
    href: "/galeri",
  },
  {
    id: "doc-3",
    type: "photo",
    image: "/assets/gallery/pertemuan-07-27-02.jpeg",
    countLabel: "1 Foto",
    date: "24 November 2025",
    title: "Pertemuan Rutin PSI Cabang Surabaya",
    location: "Surabaya",
    href: "/galeri",
  },
  {
    id: "doc-3",
    type: "photo",
    image: "/assets/gallery/pertemuan-07-27-03.jpeg",
    countLabel: "1 Foto",
    date: "24 November 2025",
    title: "Pertemuan Rutin PSI Cabang Surabaya",
    location: "Surabaya",
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
