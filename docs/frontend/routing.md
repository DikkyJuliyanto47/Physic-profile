# Frontend Routing

Dokumen ini merancang struktur routing frontend menggunakan Next.js App
Router. Ini adalah rancangan konseptual — belum ada halaman yang
diimplementasikan.

## 1. Struktur Dasar

```
src/app/
├── (public)/
└── (admin)/
```

Public dan Admin ditempatkan sebagai Route Group terpisah agar masing-masing
memiliki root layout sendiri, tanpa nama grup tersebut muncul di URL.

## 2. Fungsi Route Group

Route Group (ditandai dengan tanda kurung, mis. `(public)`) adalah fitur
Next.js App Router untuk mengelompokkan route tanpa memengaruhi struktur URL.

Contoh:

```
src/app/(public)/tentang/page.tsx   -> URL: /tentang
src/app/(admin)/admin/berita/page.tsx -> URL: /admin/berita
```

Kegunaan utama pada project ini:

- Memisahkan layout Public dan Admin
- Menjaga struktur folder tetap rapi berdasarkan area, bukan hanya berdasarkan URL

## 3. Fungsi Layout per Area

Setiap Route Group memiliki `layout.tsx` sendiri:

- `(public)/layout.tsx` — membungkus seluruh halaman Public dengan Navbar dan
  Footer publik.
- `(admin)/admin/layout.tsx` — membungkus seluruh halaman Admin dengan
  Sidebar dan Header admin.

Layout ini terpisah dari root layout (`src/app/layout.tsx`) yang hanya berisi
elemen benar-benar global (font, metadata dasar).

## 4. Rancangan Routing Public Website

| Route | Halaman |
|---|---|
| `/` | Homepage |
| `/tentang` | Tentang PSI |
| `/kepengurusan` | Kepengurusan |
| `/anggota` | Anggota |
| `/perguruan-tinggi` | Perguruan Tinggi Anggota |
| `/akademik` | Akademik |
| `/riset-publikasi` | Riset dan Publikasi |
| `/berita` | Berita |
| `/agenda` | Agenda |
| `/galeri` | Galeri |
| `/kontak` | Kontak |

Homepage (`/`) merupakan landing page dengan konsep section: Navbar, Hero,
Berita Terbaru, Tentang PSI, Statistik Organisasi, Galeri, Agenda Terdekat,
Anggota PSI, Perguruan Tinggi Anggota, CTA Bergabung, Footer.

## 5. Rancangan Routing Admin Panel (Konseptual)

| Route | Halaman |
|---|---|
| `/admin` | Entry point Admin |
| `/admin/dashboard` | Dashboard |
| `/admin/berita` | Manajemen Berita |
| `/admin/agenda` | Manajemen Agenda |
| `/admin/anggota` | Manajemen Anggota |
| `/admin/perguruan-tinggi` | Manajemen Perguruan Tinggi |
| `/admin/kepengurusan` | Manajemen Kepengurusan |
| `/admin/publikasi` | Manajemen Riset dan Publikasi |
| `/admin/galeri` | Manajemen Galeri |

Catatan: routing Admin di atas masih konseptual. Halaman, autentikasi, dan
proteksi akses **tidak dibahas di dokumen ini** karena berada di luar scope
frontend architecture tahap ini.

## 6. Prinsip Penamaan Route

- Segmen URL menggunakan `kebab-case` (mis. `perguruan-tinggi`,
  `riset-publikasi`).
- Segmen URL menggunakan istilah Bahasa Indonesia, konsisten dengan konteks
  organisasi.

## 7. Catatan Implementasi

Dokumen ini hanya rancangan struktur. Implementasi `page.tsx` dan `layout.tsx`
untuk setiap route berada di luar scope dokumentasi tahap ini dan mengikuti
`frontend-roadmap.md`.
