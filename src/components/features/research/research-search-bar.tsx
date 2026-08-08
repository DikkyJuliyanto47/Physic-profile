/*
 * @Author: galhkoernia 
 * @Date: 2026-08-08 11:06:37 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-08 11:06:37 
 */

export function ResearchSearchBar() {
  return (
    <div className="relative w-full max-w-3xl">
      <i
        className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        aria-label="Cari jurnal, buku, HKI, penelitian, atau kata kunci lainnya"
        placeholder="Cari jurnal, buku, HKI, penelitian, atau kata kunci lainnya..."
        className="w-full rounded-lg border border-border bg-background py-3 pl-11 pr-4 text-sm text-foreground shadow-card placeholder:text-foreground-muted focus:outline-none focus:ring-2 focus:ring-primary-300"
      />
    </div>
  );
}