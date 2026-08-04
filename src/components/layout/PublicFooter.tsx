import Link from "next/link";
import { prisma } from "@/lib/prisma";

const QUICK_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Berita", href: "/berita" },
  { label: "Agenda", href: "/agenda" },
  { label: "Direktori Anggota", href: "/anggota" },
  { label: "Perguruan Tinggi", href: "/kampus" },
  { label: "Galeri", href: "/galeri" },
  { label: "Kontak", href: "/kontak" },
];

export async function PublicFooter() {
  let universities: { id: string; name: string; shortName: string | null }[] =
    [];

  try {
    universities = await prisma.university.findMany({
      orderBy: { name: "asc" },
      take: 12,
      select: { id: true, name: true, shortName: true },
    });
  } catch {
    // silently fail — footer still renders without university list
  }

  return (
    <footer className="border-t border-neutral-200 bg-primary-950 text-primary-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-500 text-sm font-bold text-white">
                PSI
              </div>
              <div>
                <p className="text-sm font-bold text-white">PSI Surabaya</p>
                <p className="text-[10px] text-primary-400">
                  Physical Society of Indonesia
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-primary-300">
              Perhimpunan Fisikawan Indonesia Cabang Surabaya. Wadah
              silaturahmi, kolaborasi riset, dan pengembangan pendidikan fisika
              di wilayah Jawa Timur.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold text-white">
              Tautan Cepat
            </h3>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-primary-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Universities */}
          <div className="sm:col-span-2 lg:col-span-2">
            <h3 className="mb-4 text-sm font-semibold text-white">
              Kampus Anggota
            </h3>
            {universities.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {universities.map((uni) => (
                  <Link
                    key={uni.id}
                    href="/kampus"
                    className="rounded-full border border-primary-700 bg-primary-800/50 px-3 py-1 text-xs font-medium text-primary-200 transition-colors hover:border-primary-500 hover:bg-primary-700/50 hover:text-white"
                  >
                    {uni.shortName ?? uni.name}
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-primary-400">
                Memuat data kampus...
              </p>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="border-t border-primary-800 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-primary-400">
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
                psi-surabaya@.or.id
              </span>
              <span className="inline-flex items-center gap-1.5">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                Surabaya, Jawa Timur
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-primary-400">
              <Link
                href="/login"
                className="transition-colors hover:text-white"
              >
                Admin Login
              </Link>
              <span>&copy; {new Date().getFullYear()} PSI Surabaya</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
