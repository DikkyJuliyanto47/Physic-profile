# Frontend Development Guidelines

Dokumen ini berisi pedoman praktis untuk penulisan kode frontend. Tujuannya
menjaga konsistensi tanpa membuat aturan yang berlebihan.

## 1. Naming Convention

| Jenis | Konvensi | Contoh |
|---|---|---|
| Folder | `kebab-case` | `perguruan-tinggi` |
| Route segment | `kebab-case`, Bahasa Indonesia | `riset-publikasi` |
| Component file | `PascalCase.tsx` | `PublicNavbar.tsx` |
| Hook file | `use-kebab-case.ts` | `use-media-query.ts` |
| Type file | `kebab-case.ts` | `news.ts` |
| Utility file | `kebab-case.ts` | `format-date.ts` |

## 2. File Naming

- `page.tsx` dan `layout.tsx` mengikuti konvensi wajib Next.js App Router,
  tidak diganti nama.
- Satu file komponen berisi satu komponen utama. Sub-komponen kecil yang
  hanya dipakai internal boleh berada di file yang sama.

## 3. Component Naming

- Nama komponen menggunakan `PascalCase` dan sebaiknya deskriptif terhadap
  fungsinya, bukan bentuk visualnya (mis. `NewsCard`, bukan `Card2`).
- Export komponen menggunakan named export, kecuali untuk `page.tsx` dan
  `layout.tsx` yang wajib default export sesuai konvensi Next.js.

## 4. Folder Naming

- Folder domain di `components/features/` dan `actions/` mengikuti nama
  domain yang sama dengan struktur routing agar mudah ditelusuri.

## 5. TypeScript Guidelines

- Hindari `any`. Jika tipe data dari integration boundary belum pasti,
  gunakan tipe eksplisit sementara di `src/types/` dan tandai sebagai TBD,
  bukan langsung `any`.
- Props komponen selalu didefinisikan dengan `interface` atau `type` yang
  eksplisit, tidak inferred dari pemakaian.

## 6. Component Reusability

- Sebelum membuat komponen baru, cek apakah komponen serupa sudah ada di
  `ui/` atau `features/`.
- Reuse dilakukan setelah ada kebutuhan konkret kedua, bukan diasumsikan di
  awal (lihat juga `component-architecture.md` bagian 7).

## 7. Server vs Client Component

- Default: Server Component.
- Gunakan `"use client"` hanya jika komponen membutuhkan salah satu dari:
  `useState`, `useEffect`, browser API, atau event handler interaktif.
- Jika hanya sebagian kecil dari halaman yang butuh interaktivitas,
  pisahkan bagian tersebut menjadi Client Component kecil, bukan menjadikan
  seluruh halaman Client Component.

## 8. Tailwind CSS Usage

- Gunakan utility class langsung di komponen, hindari CSS file terpisah
  kecuali untuk kebutuhan global (`globals.css`).
- Hindari duplikasi kombinasi class yang panjang di banyak tempat — jika satu
  kombinasi dipakai berulang, itu tanda kebutuhan komponen `ui/`, bukan tanda
  kebutuhan class custom baru.

## 9. Responsive Design

- Setiap komponen visual dirancang mobile-first, kemudian disesuaikan untuk
  breakpoint `md` ke atas sesuai kebutuhan.
- Public Website memprioritaskan tampilan mobile karena mayoritas pengunjung
  kemungkinan mengakses dari perangkat mobile.

## 10. Accessibility

- Elemen interaktif (button, link, form) wajib memiliki label yang jelas,
  baik secara visual maupun untuk screen reader (`aria-label` jika perlu).
- Kontras warna teks terhadap background mengikuti standar keterbacaan umum,
  disesuaikan setelah token warna final tersedia (lihat `design-system.md`).

## 11. Loading State

- Halaman atau komponen yang menunggu data dari integration boundary wajib
  memiliki representasi loading state yang konsisten (mis. skeleton atau
  spinner dari `ui/`), bukan tampilan kosong tanpa indikasi.

## 12. Empty State

- Setiap daftar data (berita, agenda, anggota, dst.) wajib memiliki tampilan
  khusus saat data kosong, bukan membiarkan area kosong tanpa keterangan.

## 13. Error State

- Kegagalan pengambilan data ditampilkan dengan pesan yang jelas ke
  pengguna, bukan halaman kosong atau crash tanpa penjelasan.

## 14. Code Organization

- Logic presentasi (tampilan) dipisahkan dari logic domain jika komponen
  mulai kompleks — tetapi pemisahan ini dilakukan saat benar-benar
  dibutuhkan, bukan di awal secara default.
- Import antar layer mengikuti arah ketergantungan yang sudah ditetapkan di
  `component-architecture.md` dan `architecture.md`.

## 15. Prinsip Umum

- Keep it simple.
- Hindari abstraksi prematur.
- Hindari duplikasi UI — namun jangan memaksakan reuse jika dua kasus
  sebenarnya berbeda kebutuhan.
- Komponen tetap fokus pada satu tanggung jawab.
- Pisahkan presentasi dari logic hanya ketika kompleksitas memang menuntutnya.
