import Link from "next/link";

export const ADMIN_PAGE_SIZE = 20;

export function adminPage(value?: string) {
  const page = Number(value);
  return Number.isSafeInteger(page) &&
    page > 0 &&
    page <= Math.floor(2147483647 / ADMIN_PAGE_SIZE)
    ? page
    : 1;
}

export function AdminPagination({
  page,
  total,
  params,
  pageKey = "page",
  label = "Halaman",
}: {
  page: number;
  total: number;
  params: Record<string, string | undefined>;
  pageKey?: string;
  label?: string;
}) {
  const pages = Math.max(1, Math.ceil(total / ADMIN_PAGE_SIZE));
  if (pages <= 1) return null;
  function pageLink(next: number) {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && key !== "result" && key !== pageKey)
        query.set(key, value);
    }
    query.set(pageKey, String(next));
    return `?${query}`;
  }
  return (
    <nav
      aria-label={label}
      className="flex flex-wrap items-center gap-3 text-sm font-medium text-primary-700"
    >
      {page > 1 && (
        <Link href={pageLink(Math.min(page - 1, pages))}>Sebelumnya</Link>
      )}
      {page < pages && <Link href={pageLink(page + 1)}>Berikutnya</Link>}
    </nav>
  );
}
