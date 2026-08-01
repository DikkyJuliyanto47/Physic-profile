# Frontend Architecture

Dokumen ini menjelaskan arsitektur frontend PSI Surabaya dari sisi struktur
kode, bukan dari sisi backend. Bagian yang bersinggungan dengan server hanya
dijelaskan secara konseptual dan ditandai sebagai **integration boundary**.

## 1. Next.js App Router

Frontend dibangun di atas Next.js App Router (`src/app/`). App Router dipilih
karena mendukung:

- Nested layout per area (Public vs Admin)
- Server Component sebagai default rendering model
- Route Groups untuk memisahkan struktur tanpa memengaruhi URL

## 2. Server Components

Server Component adalah default untuk seluruh halaman, kecuali ada kebutuhan
interaktivitas client. Keuntungan untuk project ini:

- Rendering di server, cocok untuk Public Website yang mengutamakan SEO
- Tidak mengirim JavaScript yang tidak perlu ke browser
- Bisa langsung memanggil data layer di server (integration boundary —
  detail pemanggilan data didokumentasikan di layer backend, bukan di sini)

## 3. Client Components

Client Component (`"use client"`) dipakai hanya jika halaman/komponen
membutuhkan salah satu dari:

- `useState` / `useEffect`
- Browser API (localStorage, window, dsb.)
- Event-driven interaction (onClick, onChange, dsb.)
- Client-side interactivity lain (animasi, toggle, dsb.)

Jika sebuah komponen tidak membutuhkan hal di atas, komponen tersebut wajib
tetap menjadi Server Component.

## 4. Route Groups

Route Groups (`(public)` dan `(admin)`) digunakan untuk memisahkan root
layout Public Website dan Admin Panel tanpa memunculkan nama grup tersebut di
URL. Ini memungkinkan dua pengalaman pengguna yang berbeda hidup dalam satu
aplikasi Next.js tanpa duplikasi routing dasar.

Detail rancangan routing ada di `routing.md`.

## 5. Layout Architecture

```
Root Layout (src/app/layout.tsx)
        |
        +-- (public) Layout   -> Public Navbar, Public Footer
        |
        +-- (admin) Layout    -> Admin Sidebar, Admin Header
```

Root layout berisi hal yang benar-benar global (mis. font, metadata dasar).
Layout per route group berisi struktur visual yang spesifik untuk area
tersebut.

## 6. Component Architecture (ringkas)

Struktur komponen dibagi berdasarkan tingkat reusability dan konteks domain:

```
src/components/
├── ui/          komponen generik, tanpa domain knowledge
├── layout/       komponen struktur halaman (navbar, sidebar, dst.)
├── forms/        komponen form reusable
└── features/     komponen dengan konteks domain (news, events, dst.)
```

Pembahasan detail dan aturan setiap folder ada di `component-architecture.md`.

## 7. Separation of Concerns

Prinsip pemisahan tanggung jawab pada layer frontend:

| Folder | Tanggung Jawab |
|---|---|
| `src/app/` | Routing dan komposisi halaman (bagaimana komponen disusun per URL) |
| `src/components/` | Unit UI yang dapat dipakai ulang dan/atau spesifik domain |
| `src/hooks/` | Logic client-side yang dapat dipakai ulang antar komponen |
| `src/config/` | Konfigurasi statis aplikasi (site metadata, struktur navigasi) |
| `src/types/` | Definisi TypeScript yang dipakai lintas komponen |
| `src/utils/` | Fungsi murni tanpa efek samping (formatting, dsb.) |

Folder `src/actions/`, `src/server/`, dan `src/lib/` merupakan bagian dari
integration boundary — frontend memanggilnya sebagai titik masuk data, namun
implementasi di dalamnya berada di luar scope dokumentasi frontend ini.

## 8. Reusable Components

Komponen dianggap reusable jika:

- Tidak memiliki asumsi terhadap satu halaman tertentu
- Menerima data melalui props, bukan hardcoded
- Tidak menyimpan business logic domain di dalamnya

Komponen semacam ini ditempatkan di `components/ui/`.

## 9. Feature-based Components

Komponen yang secara sengaja terikat pada satu domain (mis. daftar berita,
kartu anggota) ditempatkan di `components/features/<domain>/`. Komponen ini
boleh menggunakan komponen dari `ui/`, `layout/`, dan `forms/`, tetapi tidak
sebaliknya.

## 10. Integration Boundary

Beberapa folder existing (`src/actions/`, `src/server/`, `src/lib/`) menjadi
titik pertemuan frontend dan backend. Dari sisi frontend, aturannya sederhana:

- Komponen tidak boleh memanggil database atau service secara langsung.
- Pemanggilan data selalu melalui satu titik masuk yang telah disiapkan di
  layer integration boundary tersebut.

Detail implementasi di balik boundary ini bukan bagian dari dokumentasi
frontend.
