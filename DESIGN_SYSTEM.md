# Design System — PSI Surabaya

## 1. Design Overview

Antarmuka memakai identitas biru dan navy dengan permukaan putih/netral, layout berbasis section, serta tipografi sans-serif. Website publik dan dashboard berbagi sebagian token dan primitif UI, tetapi memiliki layout navigasi serta pola halaman yang berbeda. Sumber token utama adalah `src/app/globals.css`; kelas komponen di `src/components/ui` menunjukkan pemakaian aktual.

## 2. Design Tokens

### Warna

Nilai berikut didefinisikan di CSS `@theme`. Token primary dan neutral merupakan nilai yang tersedia; tidak ada token bernama `secondary` terpisah.

| Token | Nilai |
|---|---|
| `primary-50` | `#eff6ff` |
| `primary-100` | `#dbeafe` |
| `primary-200` | `#bfdbfe` |
| `primary-300` | `#93c5fd` |
| `primary-400` | `#6d98e8` |
| `primary-500` | `#457ce2` |
| `primary-600` | `#2b69dd` |
| `primary-700` | `#1d5cb8` |
| `primary-800` | `#184b96` |
| `primary-900` | `#0d2952` |
| `primary-950` | `#0b2545` |
| `neutral-0` | `#ffffff` |
| `neutral-50` | `#f5f7fa` |
| `neutral-100` | `#eef1f5` |
| `neutral-200` | `#e5e5e6` |
| `neutral-300` | `#cbd5e1` |
| `neutral-500` | `#6b7280` |
| `neutral-700` | `#4b5563` |
| `neutral-900` | `#252525` |

Alias semantic: `background` → `neutral-0`, `background-muted` → `neutral-50`, `foreground` → `neutral-900`, `foreground-muted` → `neutral-700`, dan `border` → `neutral-300`.

### Bentuk, elevasi, dan layout

| Token | Nilai |
|---|---|
| `--radius-sm` / `rounded-sm` | `0.375rem` |
| `--radius-md` / `rounded-md` | `0.5rem` |
| `--radius-lg` / `rounded-lg` | `0.75rem` |
| `--radius-xl` / `rounded-xl` | `1rem` |
| `--shadow-card` | `0 1px 3px rgba(11, 37, 69, 0.08), 0 1px 2px rgba(11, 37, 69, 0.06)` |
| `--shadow-elevated` | `0 8px 24px rgba(11, 37, 69, 0.12)` |
| `--container-max` | `80rem` |

`Container` menerapkan lebar maksimum tersebut dengan padding horizontal `px-4 sm:px-6 lg:px-8`. Tidak ada skala spacing khusus; komponen memakai utility spacing Tailwind CSS.

## 3. Typography

CSS theme mendefinisikan `--font-sans` sebagai `"Inter", ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif`. Root layout juga mengimpor font `Geist` dan `Geist_Mono` melalui `next/font/google`, tetapi deklarasi body memakai `--font-sans`, bukan variabel Geist. Karena Inter tidak dimuat secara eksplisit pada root layout, font yang tampil dapat bergantung pada font yang tersedia dan fallback browser.

Heading menggunakan utility Tailwind langsung, bukan skala heading token terpisah. Contohnya `PageHeader` memakai `text-4xl` lalu `md:text-5xl`; `PublicPageShell` memakai ukuran bertahap `text-xl`, `sm:text-2xl`, dan `lg:text-3xl`. Body dan deskripsi umumnya memakai `text-sm`, `text-base`, atau `text-lg`, dengan weight `font-medium`, `font-semibold`, dan `font-bold` sesuai hierarki.

## 4. Layout & Responsive

- `Container` memusatkan konten dan membatasi lebar pada `80rem`.
- `Section` menyediakan tone `default`, `muted`, dan `dark`, serta padding `none`, `compact`, `normal`, dan `large`.
- Halaman publik memakai section vertikal dan beberapa halaman menggunakan `PublicPageShell` dengan hero, navigasi section, dan konten utama.
- Breakpoint memakai default Tailwind CSS 4, tanpa konfigurasi breakpoint khusus yang ditemukan. Implementasi menggunakan `sm`, `md`, `lg`, `xl`, dan `2xl`.
- Navigasi publik menyediakan komponen mobile; dashboard memiliki sidebar yang dapat dibuka/tutup dan topbar dengan layout responsif.
- Grid dan ukuran kolom berubah melalui utility responsive per halaman/komponen; tidak ada satu aturan grid global untuk seluruh fitur.

## 5. Reusable UI Components

Komponen berikut berada di `src/components/ui` dan diekspor melalui `index.ts`.

| Komponen | Fungsi dan varian |
|---|---|
| `Button` | Elemen button atau link; varian `primary`, `secondary`, `outline`, `ghost`, `white`; ukuran `small`, `medium`, `large`; mendukung ikon dan lebar penuh. |
| `Badge` | Label ringkas dengan tone `primary`, `neutral`, atau `dark`. |
| `Card` | Permukaan ber-border dengan padding opsional. |
| `Container` | Pembungkus konten terpusat dengan lebar/padding konsisten. |
| `Section` | Pembungkus section dengan tone dan ukuran padding yang dapat dipilih. |
| `Hero` | Header halaman publik dengan gambar latar, breadcrumb, judul, dan konten opsional. |
| `PageHeader`, `PageBreadcrumb` | Pola heading halaman dan breadcrumb. |
| `PublicPageShell` | Komposisi hero, judul, share action, navigasi section opsional, dan area konten. |
| `SectionHeading`, `SectionNav` | Heading section dan navigasi ke bagian dalam halaman. |
| `PersonCard` | Kartu ringkas profil/nama dengan subtitle, tag, ukuran avatar, dan link opsional. |
| `ShareActions` | Aksi berbagi pada halaman publik. |

Kerangka navigasi publik/admin berada di `src/components/layout`; form domain admin berada di `src/components/admin`; komponen spesifik fitur dikelompokkan di `src/components/features`.

## 6. Public UI vs Admin UI

- **Public:** memakai `PublicNavbar`, `PublicFooter`, hero/section, breadcrumb, dan navigasi mobile. Konten disusun sebagai halaman informasi dengan fokus pada keterbacaan dan eksplorasi antarhalaman.
- **Admin:** memakai `AdminSidebar`, `AdminTopbar`, area konten dengan padding responsif, tabel/list dan form pengelolaan. Sidebar memiliki state buka/tutup; menu akun menyediakan aksi logout.
- Keduanya dapat memakai token CSS yang sama, tetapi beberapa layar autentikasi menggunakan nilai warna/efek langsung pada utility class, bukan seluruhnya melalui token semantik.

## 7. UI States & Interactions

- **Hover:** `Button` memiliki warna hover per varian; beberapa link, kartu, dan item navigasi juga memiliki transisi lokal.
- **Focus:** `Button` menyediakan `focus-visible` ring; `.admin-shell` memberikan outline global untuk elemen interaktif. Implementasi elemen lain menggunakan pola focus lokal.
- **Disabled/loading:** `Button` mendukung disabled opacity dan menonaktifkan pointer; form admin mengelola state submit/loading secara per komponen. Tidak ada satu primitive loading untuk seluruh form.
- **Loading halaman:** terdapat `loading.tsx` untuk area public dan admin.
- **Empty/error/success:** pola ditentukan per halaman atau form; belum ada rangkaian state bersama yang konsisten untuk semua modul. Backlog audit terkait dirujuk pada `TODO.md`.

## 8. UI Guidelines

1. Gunakan token CSS dan alias semantic yang telah tersedia untuk warna, permukaan, teks, dan border; hindari membuat nilai warna baru tanpa kebutuhan yang jelas.
2. Gunakan `Container`, `Section`, `Button`, `Card`, `Badge`, serta komponen UI lain sebelum membuat pola duplikat.
3. Tempatkan komponen generik di `components/ui`, struktur navigasi/layout di `components/layout`, form CMS di `components/admin`, dan UI domain di `components/features/<domain>`.
4. Pertahankan kelas responsive mengikuti breakpoint Tailwind yang telah digunakan; pastikan kontrol dapat dipakai dengan keyboard dan memiliki focus state.
5. Pertahankan perbedaan kebutuhan visual public dan admin, sambil menggunakan token dan komponen bersama jika memang sesuai.
6. Saat mengubah state loading, error, empty, atau success, periksa perilaku modul terkait karena implementasinya masih tersebar. Lihat `TODO.md` untuk backlog audit.
