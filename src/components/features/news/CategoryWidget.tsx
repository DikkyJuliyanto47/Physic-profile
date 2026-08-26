import Link from "next/link";

const CATEGORIES = [
  { value: "", label: "Semua" },
  { value: "ORGANISASI", label: "Organisasi" },
  { value: "SEMINAR", label: "Seminar" },
  { value: "WORKSHOP", label: "Workshop" },
  { value: "PERTEMUAN_RUTIN", label: "Pertemuan Rutin" },
  { value: "KERJASAMA", label: "Kerjasama" },
  { value: "PRESTASI_ANGGOTA", label: "Prestasi Anggota" },
];

interface CategoryWidgetProps {
  activeCategory?: string;
}

export function CategoryWidget({ activeCategory = "" }: CategoryWidgetProps) {
  return (
    <nav aria-label="Kategori berita" className="border-y border-border">
      <div className="flex flex-wrap">
        {CATEGORIES.map((category) => {
          const params = new URLSearchParams();

          if (category.value) {
            params.set("kategori", category.value);
          }

          const href = params.size ? `/news?${params}` : "/news";
          const active = activeCategory === category.value;

          return (
            <Link
              key={category.value || "all"}
              href={href}
              className={`border-b-2 px-0 py-3 mr-6 text-sm font-medium transition-colors ${
                active
                  ? "border-primary-700 text-primary-800"
                  : "border-transparent text-foreground-muted hover:border-primary-200 hover:text-primary-700"
              }`}
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}