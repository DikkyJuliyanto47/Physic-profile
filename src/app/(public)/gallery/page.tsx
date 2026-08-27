import { PublicPageShell } from "@/components/ui/index";
import { JoinCtaSection } from "@/components/features/home/index";
import {
  DocumentationGrid,
  GalleryContributionCta,
} from "@/components/features/gallery";
import type { DocumentationItem } from "@/components/features/gallery/data";
// import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

// Production: gunakan data gallery dari database.
// const gallery = await prisma.gallery.findMany({
//   orderBy: [
//     { isFeatured: "desc" },
//     { sortOrder: "asc" },
//     { createdAt: "desc" },
//   ],
// });

// Development: dummy data sementara untuk testing dan polishing UI.
const documentationItems: DocumentationItem[] = [
  {
    id: "gallery-1",
    type: "photo",
    image: "https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1200&q=80",
    countLabel: "Foto",
    date: "12 Agustus 2026",
    title: "Pertemuan Anggota PSI Cabang Surabaya",
    location: "Surabaya",
    href: "https://images.unsplash.com/photo-1531058020387-3be344556be6",
    description: "Dokumentasi pertemuan dan diskusi anggota Physical Society Indonesia Cabang Surabaya.",
    isFeatured: true,
  },
  {
    id: "gallery-2",
    type: "photo",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80",
    countLabel: "Foto",
    date: "28 Juli 2026",
    title: "Seminar dan Diskusi Fisika",
    location: "Surabaya",
    href: "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
    description: "Dokumentasi kegiatan seminar dan diskusi ilmiah bersama anggota serta mitra PSI.",
    isFeatured: true,
  },
  {
    id: "gallery-3",
    type: "photo",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
    countLabel: "Foto",
    date: "15 Juni 2026",
    title: "Kegiatan Kolaborasi Anggota",
    location: "Surabaya",
    href: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    description: "Dokumentasi kolaborasi dan kegiatan bersama anggota komunitas fisika di Surabaya.",
    isFeatured: false,
  },
  {
    id: "gallery-4",
    type: "photo",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    countLabel: "Foto",
    date: "22 Mei 2026",
    title: "Forum Pendidikan dan Sains",
    location: "Surabaya",
    href: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655",
    description: "Dokumentasi forum yang mempertemukan akademisi, pendidik, dan anggota PSI.",
    isFeatured: false,
  },
  {
    id: "gallery-5",
    type: "video",
    image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1200&q=80",
    countLabel: "Video",
    date: "10 April 2026",
    title: "Diskusi Ilmiah PSI Cabang Surabaya",
    location: "Surabaya",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Rekaman video kegiatan diskusi ilmiah dan berbagi pengetahuan bersama anggota PSI.",
    isFeatured: true,
  },
  {
    id: "gallery-6",
    type: "video",
    image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1200&q=80",
    countLabel: "Video",
    date: "18 Maret 2026",
    title: "Seminar Fisika dan Teknologi",
    location: "Surabaya",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    description: "Rekaman kegiatan seminar mengenai perkembangan fisika dan teknologi.",
    isFeatured: false,
  },
];

export default function GaleriPage() {
  return (
    <>
      <PublicPageShell
        title="Dokumentasi Kegiatan Physical Society of Indonesia Cabang Surabaya"
        breadcrumbs={[
          { label: "Beranda", href: "/" },
          { label: "Galeri" },
        ]}
        navItems={[
          { label: "Semua", href: "#semua" },
          { label: "Foto", href: "#foto" },
          { label: "Video", href: "#video" },
        ]}
        defaultActiveHref="#semua"
      >
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
            Dokumentasi Physical Society of Indonesia Cabang Surabaya
          </p>

          <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Rekam Jejak Kegiatan
          </h2>

          <p className="mt-4 text-base leading-7 text-foreground-muted">
            Rekam jejak kegiatan, pertemuan, dan kolaborasi PSI Cabang Surabaya
            bersama anggota serta mitra organisasi.
          </p>
        </div>

        <DocumentationGrid items={documentationItems} />
      </PublicPageShell>

      <GalleryContributionCta />
      <JoinCtaSection />
    </>
  );
}