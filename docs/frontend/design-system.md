# Design System Existing

Sumber nilai visual adalah `src/app/globals.css` dengan `@import "tailwindcss"` dan blok `@theme` (Tailwind CSS 4). Komponen memakai token maupun utility langsung; tidak ada konfigurasi Tailwind JS terpisah yang menjadi sumber token ini.

## Token warna

| Kelompok | Nilai existing |
|---|---|
| primary 50/100/200/300 | #eff6ff / #dbeafe / #93c5fd / #bfdbfe |
| primary 400/500/600/700 | #6d98e8 / #457ce2 / #2b69dd / #1d5cb8 |
| primary 800/900/950 | #184b96 / #0d2952 / #0b2545 |
| neutral 0/50/100/200 | #ffffff / #f5f7fa / #eef1f5 / #e5e5e6 |
| neutral 300/500/700/900 | #cbd5e1 / #6b7280 / #4b5563 / #252525 |

Alias background -> neutral-0, background-muted -> neutral-50, foreground -> neutral-900, foreground-muted -> neutral-700, border -> neutral-300. Warna status pada komponen juga memakai utility emerald/green/red/amber.

## Tipografi dan ukuran

Root layout memuat Geist/Geist Mono dan memasang variabelnya pada html. Namun body secara eksplisit memakai `--font-sans`, yang di `globals.css` masih berisi Inter dan fallback sistem. Memuat font di root tidak otomatis berarti body memakai Geist; konfigurasi tersebut perlu dibaca sebagai dua deklarasi berbeda.

Heading/body memakai skala utility Tailwind pada komponennya. Spacing dan breakpoint memakai skala bawaan; komponen menyesuaikan melalui sm/md/lg/xl. Container memakai `--container-max: 80rem`.

| Token | Nilai |
|---|---|
| radius-sm/md/lg/xl | 0.375rem / 0.5rem / 0.75rem / 1rem |
| shadow-card | 0 1px 3px rgba(11,37,69,.08), 0 1px 2px rgba(11,37,69,.06) |
| shadow-elevated | 0 8px 24px rgba(11,37,69,.12) |

## Primitive dan global style

`src/components/ui/` menyediakan Button (button atau Link sesuai href), Container, Section, SectionHeading, Card, dan Badge, beserta komponen presentasi halaman. Prop aktual dibaca dari file masing-masing; Button memakai size small/medium/large dan variant primary/secondary/outline/ghost/white.

Global style mengatur smooth scrolling, warna body, font smoothing, seleksi teks, indikator focus-visible pada admin-shell, serta scrollbar news-scroll. Public layout memuat Font Awesome melalui stylesheet CDN; komponen juga memakai ikon SVG/library sesuai source. Tidak semua ikon melalui satu komponen abstraksi.
