import type { Publication, PublicationCategory } from "./types";

const CATEGORY_LABEL: Record<PublicationCategory, string> = {
  BUKU: "Buku",
  HKI: "HKI",
  JURNAL: "Jurnal",
  PROSIDING: "Prosiding",
};

const CATEGORY_ORDER: PublicationCategory[] = [
  "JURNAL",
  "PROSIDING",
  "BUKU",
  "HKI",
];

function getCategoryId(category: PublicationCategory) {
  return category.toLowerCase();
}

function PublicationItem({ publication }: { publication: Publication }) {
  return (
    <article className="border-b border-neutral-200 py-7 first:pt-0 last:border-b-0">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_160px] lg:gap-10">
        <div className="min-w-0">
          <h3 className="max-w-3xl text-base font-semibold leading-6 text-foreground">
            {publication.title}
          </h3>

          <ul className="mt-2 space-y-1 text-sm leading-6 text-foreground-muted">
            {publication.meta.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-start lg:justify-end">
          {publication.href ? (
            <a
              href={publication.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary-700 transition-colors hover:text-primary-800"
            >
              Buka publikasi
              <i
                className="fa-solid fa-arrow-up-right-from-square ml-2"
                aria-hidden="true"
              />
            </a>
          ) : (
            <span className="text-sm text-foreground-muted">
              Tautan belum tersedia
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

function PublicationGroup({
  category,
  publications,
}: {
  category: PublicationCategory;
  publications: Publication[];
}) {
  return (
    <section
      id={getCategoryId(category)}
      className="scroll-mt-28 border-t border-neutral-200 py-10 lg:py-12"
    >
      <div className="mb-7">
        <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
          {CATEGORY_LABEL[category]}
        </h2>
      </div>

      <div>
        {publications.map((publication) => (
          <PublicationItem key={publication.id} publication={publication} />
        ))}
      </div>
    </section>
  );
}

export function RecentPublications({
  publications,
}: {
  publications: Publication[];
}) {
  const groupedPublications = CATEGORY_ORDER.map((category) => ({
    category,
    publications: publications.filter(
      (publication) => publication.category === category,
    ),
  })).filter((group) => group.publications.length > 0);

  return (
    <div id="semua-publikasi">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
          Penelitian & Publikasi
        </p>

        <h2 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Pusat Penelitian dan Publikasi
        </h2>

        <p className="mt-4 text-base leading-7 text-foreground-muted">
          Pusat informasi penelitian, publikasi ilmiah, HKI, buku, prosiding,
          dan kolaborasi penelitian anggota PSI.
        </p>
      </div>

      {publications.length === 0 ? (
        <div className="border-y border-neutral-200 py-10 text-sm text-foreground-muted">
          Belum ada publikasi yang diterbitkan.
        </div>
      ) : groupedPublications.length === 0 ? (
        <div className="border-y border-neutral-200 py-10 text-sm text-foreground-muted">
          Belum ada publikasi yang dapat ditampilkan.
        </div>
      ) : (
        <div>
          {groupedPublications.map((group) => (
            <PublicationGroup
              key={group.category}
              category={group.category}
              publications={group.publications}
            />
          ))}
        </div>
      )}
    </div>
  );
}