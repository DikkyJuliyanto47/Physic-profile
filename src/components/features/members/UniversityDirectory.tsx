import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getUniversities } from "@/lib/data";

export async function UniversityDirectory() {
  const universities = await getUniversities();

  return (
    <section
      id="perguruan-tinggi"
      aria-labelledby="university-directory-heading"
      className="scroll-mt-28 border-t border-neutral-200 py-8 sm:py-10"
    >
      <header className="mb-6">
        <h2
          id="university-directory-heading"
          className="text-xl font-semibold leading-tight tracking-tight text-primary-900 sm:text-2xl"
        >
          Perguruan Tinggi
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
          Direktori perguruan tinggi dalam jaringan anggota PSI Cabang Surabaya.
          Pilih institusi untuk melihat profil dan daftar anggotanya.
        </p>
      </header>

      {universities.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {universities.map((university) => (
            <li key={university.id} className="min-w-0">
              <Link
                href={`/universities/${university.slug ?? university.id}`}
                className="group flex h-full min-w-0 flex-col rounded-md border border-neutral-200 bg-background p-5 transition-colors duration-150 hover:border-primary-300 hover:bg-primary-50/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700 motion-reduce:transition-none"
              >
                <div className="flex h-24 items-center justify-center border-b border-neutral-200 pb-4">
                  {university.logoUrl ? (
                    <Image
                      src={university.logoUrl}
                      alt=""
                      width={160}
                      height={80}
                      unoptimized
                      className="h-20 w-40 max-w-full object-contain"
                    />
                  ) : (
                    <span
                      aria-hidden="true"
                      className="flex h-16 w-16 items-center justify-center rounded-sm bg-primary-50 text-2xl font-semibold text-primary-700"
                    >
                      {(university.shortName ?? university.name)
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </div>

                <h3 className="mt-4 wrap-anywhere text-base font-semibold leading-6 text-primary-900 group-hover:text-primary-700">
                  {university.name}
                </h3>

                {university.address && (
                  <p className="mt-2 line-clamp-3 wrap-anywhere text-sm leading-5 text-foreground-muted">
                    {university.address}
                  </p>
                )}

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-5">
                  <span className="text-xs text-foreground-muted">
                    {university._count.members} anggota
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-primary-700">
                    Lihat profil
                    <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-md border border-neutral-200 bg-background-muted px-5 py-8 text-center text-sm text-foreground-muted">
          Belum ada data perguruan tinggi.
        </p>
      )}
    </section>
  );
}
