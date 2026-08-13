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
    title: "Seminar Nasional Fisika Terapan",
    date: "12 Agustus 2026",
    excerpt:
      "Informasi dan persiapan kegiatan Seminar Nasional Fisika Terapan yang akan diselenggarakan bersama komunitas fisika.",
    image: "/assets/news/seminar-fisika-terapan.jpg",
    href: "/berita/seminar-nasional-fisika-terapan",
  },
  {
    id: "news-2",
    title: "Workshop Instrumentasi Laboratorium",
    date: "20 Agustus 2026",
    excerpt:
      "Kegiatan workshop instrumentasi laboratorium sebagai ruang berbagi pengetahuan dan pengalaman di bidang fisika.",
    image: "/assets/news/workshop-instrumentasi.jpg",
    href: "/berita/workshop-instrumentasi-laboratorium",
  },
  {
    id: "news-3",
    title: "Diskusi Ilmiah Riset Material Maju",
    date: "5 September 2026",
    excerpt:
      "Diskusi ilmiah mengenai perkembangan riset material maju dan kontribusinya terhadap perkembangan ilmu fisika.",
    image: "/assets/news/diskusi-riset-material.jpg",
    href: "/berita/diskusi-ilmiah-riset-material-maju",
  },
  {
    id: "news-4",
    title: "Koordinasi Pengurus PSI Cabang Surabaya",
    date: "27 Juli 2026",
    excerpt:
      "Rapat koordinasi pengurus untuk menyusun agenda kerja dan program kerja PSI Cabang Surabaya periode berjalan.",
    image: "/assets/news/koordinasi-pengurus.jpg",
    href: "/berita/koordinasi-pengurus-psi-cabang-surabaya",
  },
  {
    id: "news-5",
    title: "Kunjungan Akademik ke Laboratorium Fisika",
    date: "3 Juli 2026",
    excerpt:
      "Kunjungan akademik untuk memperluas wawasan anggota terkait fasilitas dan riset laboratorium fisika terkini.",
    image: "/assets/news/kunjungan-akademik.jpg",
    href: "/berita/kunjungan-akademik-laboratorium-fisika",
  },
  {
    id: "news-6",
    title: "Pelatihan Penulisan Karya Ilmiah",
    date: "15 Juni 2026",
    excerpt:
      "Pelatihan penulisan karya ilmiah bagi anggota untuk meningkatkan kualitas publikasi di bidang fisika.",
    image: "/assets/news/pelatihan-karya-ilmiah.jpg",
    href: "/berita/pelatihan-penulisan-karya-ilmiah",
  },
];