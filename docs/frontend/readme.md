# Frontend Documentation — PSI Surabaya

## Tujuan Dokumentasi

Dokumentasi ini menjadi pedoman resmi untuk pengembangan frontend website
Physical Society of Indonesia (PSI) Cabang Surabaya. Tujuannya agar setiap
developer yang mengerjakan bagian frontend punya acuan arsitektur, struktur,
dan konvensi yang sama, sebelum implementasi UI dimulai.

Dokumen ini bersifat **panduan**, bukan implementasi. Tidak ada kode, UI,
atau fitur yang dibuat pada tahap ini.

## Scope Frontend

Dokumentasi ini membahas:

- Struktur dan arsitektur frontend (Next.js App Router)
- Routing Public Website dan Admin Panel
- Struktur komponen
- Fondasi design system
- Panduan pengembangan (coding guideline)
- Roadmap implementasi frontend

Dokumentasi ini **tidak membahas**:

- Desain database / Prisma schema
- API design
- Authentication
- Business logic backend
- Deployment / infrastruktur

Bagian-bagian tersebut adalah tanggung jawab layer backend dan didokumentasikan
terpisah. Di sini, backend hanya disebut sebagai **integration boundary** —
titik di mana frontend berhenti dan backend mengambil alih.

## Teknologi Frontend

| Teknologi     | Versi     |
|---------------|-----------|
| Next.js       | 16.2.12 (App Router) |
| React         | 19.2.4    |
| TypeScript    | 5         |
| Tailwind CSS  | 4         |
| ESLint        | 9         |

Prisma dan PostgreSQL ada di repository yang sama, namun berada di luar scope
dokumentasi frontend ini.

## Gambaran Public Website

Public Website adalah area yang diakses pengunjung umum untuk membaca
informasi organisasi: Homepage, Tentang PSI, Kepengurusan, Anggota, Perguruan
Tinggi, Akademik, Riset dan Publikasi, Berita, Agenda, Galeri, dan Kontak.
Sifatnya read-only, mengutamakan kecepatan akses dan SEO.

## Gambaran Admin Panel

Admin Panel adalah area internal untuk mengelola konten yang ditampilkan di
Public Website. Pada tahap ini, Admin Panel baru didefinisikan secara
konseptual dari sisi routing dan arsitektur frontend — belum ada implementasi
dashboard atau fitur CRUD.

## Struktur Dokumentasi Frontend

| Dokumen | Isi |
|---|---|
| `README.md` | Entry point, ringkasan scope dan navigasi dokumentasi |
| `architecture.md` | Arsitektur frontend, App Router, Server/Client Component |
| `routing.md` | Rancangan routing Public dan Admin |
| `component-architecture.md` | Struktur dan aturan folder komponen |
| `design-system.md` | Fondasi design system (warna, tipografi, spacing) |
| `development-guidelines.md` | Konvensi penamaan dan aturan coding frontend |
| `frontend-roadmap.md` | Tahapan implementasi frontend |

## Prinsip Utama Frontend Architecture

1. Public dan Admin adalah dua area pengalaman pengguna yang berbeda, dengan
   layout terpisah.
2. Komponen UI harus reusable dan bebas dari domain logic.
3. Server Component adalah default; Client Component hanya dipakai jika
   benar-benar butuh interaktivitas browser.
4. Tidak ada abstraksi atau design system yang dibuat lebih kompleks dari
   yang dibutuhkan saat ini.
5. Desain UI/UX yang sudah dibuat oleh design owner adalah source of truth
   untuk seluruh keputusan visual.

## Hubungan Dokumentasi dengan Source Code

Dokumentasi ini mengikuti struktur repository yang sudah ada
(`src/actions`, `src/app`, `src/components`, `src/config`, `src/hooks`,
`src/lib`, `src/server`, `src/types`, `src/utils`) dan tidak mengubah struktur
tersebut. Setiap kali struktur atau keputusan arsitektur berubah saat
implementasi, dokumen terkait di `docs/frontend/` wajib diperbarui agar tetap
menjadi acuan yang valid.
