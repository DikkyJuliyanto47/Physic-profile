# Arsitektur Frontend

## Rendering dan layout

`src/app/` memakai App Router. Route group `(public)` dan `(admin)` tidak menjadi segmen URL. Kerangka yang benar-benar dipakai:

`src/app/layout.tsx` -> `(public)/layout.tsx` -> halaman publik.

`src/app/layout.tsx` -> `(admin)/admin/layout.tsx` -> `AdminLayoutClient` -> halaman dashboard.

Halaman login berada di luar layout dashboard. Root layout memuat stylesheet, font Geist/Geist Mono melalui `next/font`, dan metadata dasar. Public layout memasang `PublicNavbar`, `PublicFooter`, stylesheet Font Awesome, dan JSON-LD organisasi bila URL situs tersedia.

Layout dashboard memanggil guard server melalui `AuthGuard` dalam `Suspense`. `AdminLayoutClient.tsx` menyediakan `SessionProvider`, sidebar, topbar, dan state navigasi. Overview juga memanggil `requireAdmin()` sendiri sebelum query; layout bukan satu-satunya batas authorization.

## Server Components

Halaman listing dan edit admin membaca Prisma di server, menyiapkan filter ownership, metadata versi, dan props untuk form/action client. Pembatasan akses tetap dilakukan server. `ContentReviewQueue` juga Server Component.

Data publik terutama melalui `src/lib/data.ts`: query Prisma, pemetaan record ke props presentasi, format tanggal, serta sanitasi HTML berita/agenda. Fungsi data memakai `"use cache"`, `cacheLife("hours")`, dan tag per domain. `next.config.ts` mengaktifkan `cacheComponents`; jangan menganggap semua halaman database memakai `force-dynamic`.

News/Event publik memakai status `PUBLISHED`. Publication memakai `publishedAt` yang tidak null dan sudah jatuh tempo. Proposal tidak dibaca sebagai konten publik. Detail tanpa record publik memakai `notFound()`.

## Client Components

Komponen bertanda `"use client"` menangani state form, upload, dialog, pencarian interaktif, navigasi, dan mutation. Komponen client tidak mengimpor Prisma untuk query; mereka memanggil fungsi `"use server"` di `src/actions/`.

Alur utama: halaman server -> props konten dan token versi -> form/action client -> Server Action -> hasil sukses/pending/error -> feedback dan navigasi/refresh. Detail mutation dan transaksi ada di dokumentasi backend.

## Navigasi dan metadata

`src/components/layout/` berisi navigasi publik dan admin. Sidebar memakai pathname untuk indikator aktif, mode mobile, pin, dan tampilan menu menurut role. Topbar membaca session serta menyediakan logout. Konfigurasi navigasi/SEO ada di `src/config/`; metadata halaman, `src/app/robots.ts`, dan `sitemap.ts` mengatur keluaran SEO. Root mewariskan noindex; halaman publik mengatur metadata publiknya.
