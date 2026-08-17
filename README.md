# Physical Society of Indonesia (PSI) Surabaya Website

Website Physical Society of Indonesia (PSI) Surabaya yang digunakan sebagai platform publikasi kegiatan, profil organisasi, informasi akademik, serta sistem administrasi untuk mengelola konten dan anggota organisasi.

## Gambaran Proyek

Proyek ini terdiri dari dua bagian utama:

* Website publik
   - Menampilkan profil organisasi, kegiatan, berita, agenda, kepengurusan, anggota, galeri, dan publikasi.
   - Dirancang untuk kebutuhan komunikasi institusional dan penguatan citra organisasi.

* Panel administrasi
   - Digunakan untuk mengelola data konten dan struktur organisasi.
   - Memiliki dashboard serta modul pengelolaan berita, agenda, anggota, perguruan tinggi, publikasi, galeri, dokumen, dan pesan.

Aplikasi dibangun menggunakan Next.js App Router dan dihubungkan ke PostgreSQL melalui Prisma. Autentikasi admin dilakukan melalui NextAuth dengan validasi kredensial.

## Tech Stack

Teknologi yang benar-benar digunakan dalam proyek ini:

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- NextAuth
- Turbopack untuk development
- PostgreSQL adapter via Prisma (`@prisma/adapter-pg`)
- Node.js runtime dan ecosystem modern untuk project web

Catatan:
- Project ini menggunakan App Router dari Next.js.
- Pengembangan lokal berjalan melalui `next dev`, yang pada Next.js 16 memanfaatkan ekosistem Turbopack secara default.

## Struktur Folder

Pohon folder berikut merupakan versi yang disederhanakan dari repositori yang ada saat ini:

```text
.
├── docs/
│   └── frontend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   └── assets/
├── src/
│   ├── actions/
│   ├── app/
│   │   ├── (admin)/
│   │   ├── (public)/
│   │   ├── api/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── robots.ts
│   │   └── sitemap.ts
│   ├── components/
│   │   ├── admin/
│   │   ├── features/
│   │   ├── forms/
│   │   ├── layout/
│   │   └── ui/
│   ├── config/
│   ├── generated/
│   ├── hooks/
│   ├── lib/
│   ├── server/
│   ├── types/
│   ├── utils/
│   ├── auth.config.ts
│   ├── auth.ts
│   ├── middleware.ts
│   └── lib/prisma.ts
├── docker-compose.yml
├── eslint.config.mjs
├── next.config.ts
├── next-env.d.ts
├── package.json
├── postcss.config.mjs
├── prisma.config.ts
├── tsconfig.json
├── README.md
└── skills-lock.json
```

Penjelasan folder penting:

- `src/app/` : entrypoint utama aplikasi berdasarkan App Router. Terdiri dari route publik dan route admin.
- `src/actions/` : fungsi server action dan logika operasi data yang terkait dengan content management.
- `src/components/` : komponen antarmuka dan fitur. Dibagi menjadi komponen layout, admin, features, forms, dan UI umum.
- `src/lib/` : utilitas aplikasi, termasuk konfigurasi Prisma dan autentikasi mock.
- `src/config/` : konfigurasi umum situs seperti navigasi publik dan metadata.
- `src/server/` : logika backend dan service layer terkait server-side process.
- `src/types/` : definisi tipe TypeScript aplikasi.
- `prisma/` : schema database Prisma, migrasi, dan seed.
- `public/` : aset statis seperti logo, gambar, hero, galeri, dan sumber daya publik.
- `docs/` : dokumentasi frontend dan arsitektur proyek.

## Cara Menjalankan Project

Persyaratan minimum:

- Node.js 20+ (direkomendasikan Node.js LTS)
- npm
- PostgreSQL yang dapat diakses dan siap dipakai
- File `.env` yang dikonfigurasi dengan benar

Langkah setup:

```bash
npm install
npm run dev
```

Setelah itu, aplikasi dapat diakses di:

```text
http://localhost:3000
```

Untuk build produksi:

```bash
npm run build
npm run start
```

Untuk pemeriksaan kualitas kode:

```bash
npm run lint
```

## Environment Variables

Project ini menggunakan variabel lingkungan untuk koneksi database dan autentikasi. Contoh konfigurasi yang benar adalah:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
AUTH_SECRET="replace-with-secure-secret"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_MOCK_AUTH="false"
```

Catatan penting:
- `DATABASE_URL` wajib ada untuk Prisma dan koneksi database.
- `AUTH_SECRET` dipakai pada konfigurasi NextAuth di `src/auth.ts`.
- `NEXT_PUBLIC_SITE_URL` dipakai pada konfigurasi sitemap, robots, dan metadata situs.
- `NEXT_PUBLIC_MOCK_AUTH` digunakan untuk mode testing admin lokal.
- Jangan menyimpan nilai asli di repository.

## Prisma

Project ini memakai Prisma ORM untuk mengelola database PostgreSQL. Workflow umum adalah:

```bash
npx prisma generate
npx prisma migrate dev
npx prisma studio
```

Penjelasan masing-masing:

- `npx prisma generate` : menghasilkan Prisma Client sesuai dengan schema yang ada di `prisma/schema.prisma`.
- `npx prisma migrate dev` : membuat dan menerapkan migrasi database saat pengembangan. Digunakan untuk menyesuaikan struktur tabel dengan model Prisma.
- `npx prisma studio` : membuka Prisma Studio untuk melihat data yang tersimpan di database secara interaktif.

Seed database dapat dijalankan berdasarkan konfigurasi di `package.json`:

```bash
npx tsx prisma/seed.ts
```

Schema utama berada di `prisma/schema.prisma` dan mencakup model seperti `User`, `University`, `MemberProfile`, `ManagementPeriod`, `ManagementPosition`, `News`, `Event`, `Publication`, `DocumentResource`, `Gallery`, dan `ContactMessage`.

## Fitur

### Website Publik

Berikut fitur yang terlihat pada struktur halaman dan route yang tersedia:

- Beranda — Sudah ada di `src/app/(public)/page.tsx`
- Tentang — Route tersedia di `src/app/(public)/about/`
- Kepengurusan — Route tersedia di `src/app/(public)/managements/`
- Anggota — Route tersedia di `src/app/(public)/members/`
- Riset & Publikasi — Route tersedia di `src/app/(public)/research-publication/`
- Berita — Route tersedia di `src/app/(public)/news/`
- Agenda — Route tersedia di `src/app/(public)/agenda/`
- Galeri — Route tersedia di `src/app/(public)/gallery/`
- Universitas / Perguruan Tinggi — Route tersedia di `src/app/(public)/universities/`
- Dokumen — Route tersedia di `src/app/(public)/documents/`
- Kontak — Route tersedia di `src/app/(public)/contact/`

Status umum:
- Fitur publik utama sudah memiliki struktur page, komponen, dan model data yang sesuai.
- Beberapa bagian masih dapat dilanjutkan pada sisi integrasi data atau polishing UI sesuai kebutuhan produk.

### Admin

Panel administrasi tersedia pada route `/admin` dan dilengkapi dengan modul utama berikut:

- Dashboard — Sudah ada di `src/app/(admin)/admin/page.tsx`
- Manajemen Berita — Route `src/app/(admin)/admin/news/`
- Manajemen Agenda — Route `src/app/(admin)/admin/events/` dan `agenda/`
- Manajemen Anggota — Route `src/app/(admin)/admin/members/`
- Manajemen Kepengurusan — Route `src/app/(admin)/admin/managements/`
- Manajemen Perguruan Tinggi — Route `src/app/(admin)/admin/universities/`
- Manajemen Publikasi — Route `src/app/(admin)/admin/publication/`
- Manajemen Galeri — Route `src/app/(admin)/admin/gallery/`
- Manajemen Dokumen — Route `src/app/(admin)/admin/documents/`
- Pesan/Kontak — Route `src/app/(admin)/admin/messages/`
- Login Admin — Route `src/app/(admin)/login/page.tsx`

Status umum:
- Struktur admin sudah dibuat secara jelas di repository.
- Beberapa modul perlu proses validasi data, integrasi lanjut, dan penyempurnaan UX tergantung kebutuhan produksi.

## Arsitektur

Arsitektur proyek mengikuti pendekatan yang umum digunakan pada aplikasi Next.js modern:

- App Router sebagai bentuk routing utama aplikasi.
- Server Components dijadikan default untuk rendering di sisi server.
- Client Components dipakai hanya ketika dibutuhkan untuk interaksi seperti form, state, atau autentikasi.
- Prisma digunakan sebagai ORM untuk akses data PostgreSQL.
- Struktur organisasi feature-based dan modular: route, komponen fitur, layout, serta utilitas dipisahkan berdasarkan fungsi.

Prinsip utama:
- Memprioritaskan komponen yang dapat dipakai ulang.
- Memisahkan logika data, UI, dan konfigurasi situs.
- Menjaga struktur project agar mudah diakses oleh anggota tim baru.

## Development Guidelines

Beberapa pedoman yang perlu diikuti selama pengembangan:

- Gunakan TypeScript secara ketat dan hindari tipe `any` jika tidak benar-benar diperlukan.
- Jangan membuat Client Component jika fitur tersebut tidak memerlukan interaksi browser.
- Gunakan Prisma Client dari `src/lib/prisma.ts` agar konfigurasi database konsisten di seluruh aplikasi.
- Ikuti struktur feature-based dan hindari menumpuk logika bisnis ke dalam satu file besar.
- Pertahankan UI yang sederhana, konsisten, dan mudah dibaca.
- Gunakan folder dan naming yang konsisten dengan pola yang sudah ada di project.
- Untuk route admin, pastikan akses dikelola melalui auth dan middleware sesuai konfigurasi NextAuth.

## Kontribusi

Workflow kontribusi yang sederhana dan umum dipakai:

```bash
git checkout -b feature/nama-fitur
# lakukan perubahan
git add .
git commit -m "feat: menambahkan fitur X"
git push origin feature/nama-fitur
```

Setelah itu:

- Buat Pull Request ke branch utama.
- Jelaskan perubahan secara singkat.
- Pastikan build dan lint berjalan tanpa error sebelum merge.

## License

Proyek ini belum memiliki lisensi resmi yang ditetapkan. Silakan tambahkan lisensi yang sesuai sebelum digunakan dalam lingkungan produksi atau publikasi komersial.

## Catatan

Untuk memahami alur kerja secara cepat, disarankan untuk memulai dari:

- `src/app/` untuk melihat route publik dan admin
- `prisma/schema.prisma` untuk memahami model data
- `src/lib/prisma.ts` untuk konfigurasi database
- `src/auth.ts` dan `src/auth.config.ts` untuk autentikasi
- `src/config/site.ts` untuk konfigurasi navigasi dan metadata situs

README ini disusun agar menjadi dokumentasi dasar bagi tim, dengan fokus pada struktur project yang benar-benar ada di repository saat ini.
