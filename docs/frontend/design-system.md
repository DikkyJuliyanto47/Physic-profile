# Design System Foundation

Status: **EPIC 2 — implemented**. Dokumen ini menggantikan versi sebelumnya
yang seluruh nilainya masih berstatus TBD.

## 0. Metodologi

Nilai warna pada dokumen ini diambil dengan cara sampling piksel langsung
dari file referensi desain resmi (`LandingPage_PhysicsSocietyIndonesia.png`)
menggunakan analisis distribusi warna, bukan ditentukan sepihak oleh
developer. Warna yang tidak eksplisit muncul di referensi (beberapa langkah
skala neutral, warna teks sekunder) diinterpolasi mengikuti pola skala yang
sudah ada, dan ditandai sebagai **keputusan turunan** — tetap terbuka untuk
dikoreksi oleh design owner.

Implementasi menggunakan mekanisme CSS-first Tailwind CSS 4 (`@theme` di
`src/app/globals.css`), bukan `tailwind.config.js`, sesuai konvensi Tailwind
CSS 4 pada project ini.

## 1. Color System

### Primary (brand blue)

Anchor: warna tombol utama pada hero section (`Gabung sebagai anggota`).

| Token | Hex | Sumber |
|---|---|---|
| `primary-50` | `#eff6ff` | Sampled (badge/background muda) |
| `primary-100` | `#dbeafe` | Interpolasi |
| `primary-200` | `#bfdbfe` | Interpolasi |
| `primary-300` | `#93c5fd` | Interpolasi |
| `primary-400` | `#6d98e8` | Sampled (aksen bentuk dekoratif) |
| `primary-500` | `#457ce2` | Sampled |
| `primary-600` | `#2b69dd` | Sampled (warna tombol utama) |
| `primary-700` | `#1d5cb8` | Sampled |
| `primary-800` | `#184b96` | Sampled |
| `primary-900` | `#0d2952` | Sampled |
| `primary-950` | `#0b2545` | Sampled (background stats bar, CTA, footer) |

### Neutral

Anchor: background section, border, placeholder box pada referensi.

| Token | Hex | Sumber |
|---|---|---|
| `neutral-0` | `#ffffff` | Sampled (background utama) |
| `neutral-50` | `#f5f7fa` | Sampled (background section alternatif) |
| `neutral-100` | `#eef1f5` | Interpolasi |
| `neutral-200` | `#e5e5e6` | Sampled (placeholder box) |
| `neutral-300` | `#cbd5e1` | Sampled (border) |
| `neutral-500` | `#6b7280` | Interpolasi (belum ada di referensi) |
| `neutral-700` | `#4b5563` | Interpolasi (belum ada di referensi) |
| `neutral-900` | `#252525` | Sampled (warna teks body) |

### Semantic Colors

Komponen tidak boleh memakai token mentah (`primary-600`, dst.) secara
langsung untuk tujuan struktural seperti background halaman atau warna teks
dasar. Gunakan alias semantik berikut:

| Alias | Mapping | Kegunaan |
|---|---|---|
| `background` | `neutral-0` | Background dasar halaman |
| `background-muted` | `neutral-50` | Background section alternatif |
| `foreground` | `neutral-900` | Warna teks utama |
| `foreground-muted` | `neutral-700` | Warna teks sekunder/deskripsi |
| `border` | `neutral-300` | Warna border/divider |

Token warna mentah (`primary-*`, `neutral-*`) tetap dipakai untuk elemen yang
memang butuh identitas warna spesifik (tombol, badge, section gelap).

## 2. Typography

| Aspek | Keputusan |
|---|---|
| Font family | `Inter` sebagai default, dengan fallback `ui-sans-serif, system-ui` |
| Status | **Keputusan sementara**, bukan konfirmasi resmi dari design owner |
| Heading scale | Belum ditetapkan sebagai token formal — mengikuti Tailwind default (`text-2xl`, `text-3xl`, dst.) sampai kebutuhan halaman nyata muncul (EPIC 4) |
| Body text size | `text-base` (Tailwind default) |

Alasan memilih Inter: sesuai karakter visual "modern, clean, professional"
pada referensi, dan merupakan font sans-serif netral yang umum dipakai untuk
website organisasi akademik. Font belum di-load melalui `next/font` pada
EPIC ini — deklarasi `--font-sans` hanya menyiapkan fallback stack CSS, agar
tidak ada perubahan pada `layout.tsx` sebelum EPIC 3.

## 3. Spacing

Tidak ada skala spacing kustom yang dibuat. Project menggunakan skala
spacing default Tailwind CSS 4 secara langsung (`px-4`, `py-16`, dst.),
karena tidak ada bukti pada referensi bahwa dibutuhkan skala di luar default.

## 4. Border Radius

| Token | Nilai |
|---|---|
| `radius-sm` | `0.375rem` |
| `radius-md` | `0.5rem` |
| `radius-lg` | `0.75rem` |
| `radius-xl` | `1rem` |

Nilai ini overrides default Tailwind dengan skala yang lebih dekat ke
tampilan card/button pada referensi (sudut membulat sedang, tidak tajam,
tidak terlalu bulat).

## 5. Shadow

| Token | Nilai | Kegunaan |
|---|---|---|
| `shadow-card` | `0 1px 3px rgba(11,37,69,.08), 0 1px 2px rgba(11,37,69,.06)` | Card dasar (anggota, berita) |
| `shadow-elevated` | `0 8px 24px rgba(11,37,69,.12)` | Elemen yang perlu menonjol (dropdown, modal — disiapkan untuk EPIC berikutnya) |

Warna shadow memakai basis `primary-950` (bukan hitam murni) agar konsisten
dengan nuansa biru navy pada referensi.

## 6. Responsive Breakpoints

Menggunakan breakpoint default Tailwind CSS 4 tanpa modifikasi:

| Breakpoint | Nilai |
|---|---|
| `sm` | 640px |
| `md` | 768px |
| `lg` | 1024px |
| `xl` | 1280px |
| `2xl` | 1536px |

## 7. Container Width

| Token | Nilai |
|---|---|
| `--container-max` | `80rem` (1280px) |

Diimplementasikan sebagai CSS custom property, dipakai oleh komponen
`Container` (lihat bagian 9). Tidak memakai utility bawaan `container`
Tailwind agar padding horizontal tetap dapat dikontrol secara eksplisit oleh
komponen, bukan implisit dari Tailwind.

## 8. Global Styling

Ditetapkan di `src/app/globals.css`:

- `scroll-behavior: smooth` pada `html`.
- `body` memakai `background`, `foreground`, dan `font-sans` dari token di
  atas, dengan `-webkit-font-smoothing: antialiased` untuk rendering teks
  yang lebih halus.
- `::selection` memakai `primary-200` sebagai background agar konsisten
  dengan brand color, bukan warna seleksi default browser.

Tidak ada perubahan struktural lain pada global styling di luar yang
disebutkan di atas.

## 9. Component Primitives

Seluruh primitive berada di `src/components/ui/` dan diekspor melalui
`src/components/ui/index.ts`.

### Button

Mendukung dua mode render: `<button>` (default) atau `<a>` melalui
`next/link` jika prop `href` diisi — satu komponen, dua kebutuhan (aksi vs
navigasi), tanpa membuat komponen `Link` terpisah.

| Prop | Nilai | Default |
|---|---|---|
| `variant` | `primary` \| `secondary` \| `outline` \| `ghost` | `primary` |
| `size` | `sm` \| `md` \| `lg` | `md` |
| `icon` | `ReactNode` | - |
| `iconPosition` | `left` \| `right` | `left` |
| `fullWidth` | `boolean` | `false` |

`variant="primary"` memakai `primary-600`, `variant="secondary"` memakai
`primary-950` — sesuai dua level tombol yang terlihat pada referensi
(tombol biru terang di hero, tombol gelap di CTA/footer).

### Container

Membungkus konten dengan `max-width` mengikuti `--container-max` dan padding
horizontal responsif (`px-4` di mobile, naik ke `px-8` di breakpoint besar).

### Section

Membungkus satu section halaman dengan vertical padding konsisten
(`py-16` sampai `py-24` mengikuti breakpoint) dan tone background:

| Tone | Kegunaan |
|---|---|
| `default` | Section dengan background putih |
| `muted` | Section dengan background `background-muted` (mis. area berita/galeri) |
| `dark` | Section dengan background `primary-950` (mis. stats bar, CTA, footer) |

### SectionHeading

Merepresentasikan pola eyebrow + judul yang berulang pada referensi
(`BERITA` / `Berita Terbaru`, `TENTANG KAMI` / `Sekilas tentang PSI Cabang
Surabaya`, `AGENDA KEGIATAN` / `Agenda Terdekat`, dst.). Mendukung `align`
(`left` default, `center` untuk section seperti Galeri) dan slot `action`
untuk tautan seperti "Lihat Semua Berita".

### Card

Primitive dasar untuk konten berbentuk kartu (anggota, berita, agenda).
Memakai `border`, `shadow-card`, dan `radius-lg` secara default. Tidak
memiliki varian domain (mis. `MemberCard`) — komposisi domain-specific
diserahkan ke `components/features/` sesuai `component-architecture.md`.

### Badge

Primitive untuk label kecil (tanggal, status, tag). Tiga tone (`primary`,
`neutral`, `dark`) cukup untuk kebutuhan yang terlihat pada referensi.

## 10. Aturan Penggunaan Komponen

1. Komponen halaman/feature tidak boleh menulis ulang kombinasi utility
   Tailwind yang sudah direpresentasikan oleh primitive di atas — gunakan
   primitive, jangan duplikasi style.
2. Warna mentah (`primary-600`, dst.) hanya dipakai di dalam primitive atau
   saat benar-benar butuh identitas warna spesifik, bukan tersebar bebas di
   komponen `features/`.
3. Penambahan varian baru pada primitive (mis. `variant` baru di `Button`)
   harus didasarkan pada kebutuhan nyata dari halaman yang sedang dibangun,
   bukan diantisipasi lebih awal.

## 11. Ikon

Belum ada komponen ikon yang diimplementasikan pada EPIC ini karena tidak
ada primitive di Task 3 yang secara langsung membutuhkannya. Jika
implementasi selanjutnya (EPIC 3 dst.) membutuhkan ikon, gunakan Font
Awesome sesuai instruksi — tanpa menambah dependency npm baru, disarankan
memuat melalui CDN Font Awesome di `layout.tsx` dan memakai class-based icon
(`<i className="fa-solid fa-...">`). Keputusan ini didokumentasikan di sini
agar tidak diputuskan ulang secara ad-hoc saat implementasi halaman.

## 12. Yang Masih TBD

- Konfirmasi resmi font family (`Inter` masih berstatus keputusan sementara)
- Heading scale formal (H1-H6) sebagai token, bukan class Tailwind langsung
- Warna supporting/aksen di luar biru-navy-neutral (belum terlihat kebutuhan
  konkret pada referensi landing page)
- Skala neutral tambahan jika komponen mendatang membutuhkan (mis.
  `neutral-400`, `neutral-600`)
