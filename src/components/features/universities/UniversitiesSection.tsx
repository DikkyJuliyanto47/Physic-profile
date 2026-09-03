import Image from "next/image";
import Link from "next/link";
import { getUniversities } from "@/lib/data";

export async function UniversitiesSection() {
  const universities = await getUniversities();

  return (
    <section id="perguruan-tinggi" className="scroll-mt-28 border-t border-neutral-200 py-12 sm:py-14 lg:py-16">
      {universities.length > 0 ? (
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
          {universities.map((university) => (
            <Link key={university.id} href={`/universities/${university.slug ?? university.id}`} className="group min-w-0">
              <div className="flex h-28 items-center">
                {university.logoUrl ? (
                  <Image
                    src={university.logoUrl}
                    alt={university.name}
                    width={160}
                    height={160}
                    unoptimized
                    className="max-h-24 max-w-40 object-contain object-left"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center border border-primary-100 bg-primary-50">
                    <span className="text-3xl font-bold text-primary-700">
                      {(university.shortName ?? university.name).charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-neutral-200 pt-4">
                <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-primary-700">
                  {university.shortName ?? university.name}
                </h3>

                {university.shortName && (
                  <p className="mt-1 text-sm leading-5 text-foreground-muted">
                    {university.name}
                  </p>
                )}

                {university.address && (
                  <p className="mt-3 line-clamp-2 text-sm leading-5 text-foreground-muted">
                    {university.address}
                  </p>
                )}

                <p className="mt-4 text-xs font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {university._count.members} anggota
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-y border-neutral-200 py-10 text-center">
          <p className="text-sm text-foreground-muted">
            Belum ada data perguruan tinggi.
          </p>
        </div>
      )}
    </section>
  );
}