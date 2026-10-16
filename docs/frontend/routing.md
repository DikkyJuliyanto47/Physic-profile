# Routing Aktual

Nama route mengikuti folder `src/app/`, bukan terjemahan label menu.

## Publik

Sumber: `src/app/(public)/`.

| URL | Isi |
|---|---|
| `/` | Landing page organisasi |
| `/about` | Profil organisasi |
| `/managements` | Kepengurusan |
| `/members` | Direktori anggota |
| `/universities`, `/universities/[slug]` | Direktori dan detail perguruan tinggi |
| `/research` | Riset dan publikasi |
| `/news`, `/news/[slug]` | Daftar dan detail berita |
| `/events`, `/events/[slug]` | Daftar dan detail agenda |
| `/gallery` | Galeri |
| `/contact` | Informasi kontak |

## Admin

Sumber: `src/app/(admin)/`.

| URL | Isi |
|---|---|
| `/login` | Login credentials dan opsi mock pada mode development yang diaktifkan |
| `/forgot-password`, `/reset-password` | Halaman presentasi pemulihan; tidak membuktikan adanya backend pengiriman email/token reset |
| `/admin` | Overview |
| `/admin/news`, `/admin/events`, `/admin/members`, `/admin/universities`, `/admin/publication`, `/admin/gallery` | Listing konten |
| Route listing di atas + `/new` atau `/[id]/edit` | Form create/edit |
| `/admin/managements`, `/admin/managements/create`, `/admin/managements/[id]/edit` | Periode dan posisi kepengurusan |
| `/admin/submissions` | Pengajuan milik akun |
| `/admin/review` | Review oleh Admin PSI Surabaya |
| `/admin/admins` | Pengelolaan akun oleh Admin PSI Surabaya |

Posisi diedit melalui parameter `positionId` pada halaman pengelolaan periode. Listing biasa memakai `page`; struktur kepengurusan pada halaman utama memakai `positionsPage` terpisah. Filter spesifik modul berada dalam search params halaman, misalnya `q`, `status`, `universityId`, `type`, dan `category`. Review memakai `kind` dan `review`.

## Endpoint pendukung

| Endpoint | Handler |
|---|---|
| `/api/auth/[...nextauth]` | `src/app/api/auth/[...nextauth]/route.ts`: GET/POST dari `@/auth` |
| `/api/upload` | POST upload, DELETE sinyal release |
| `/api/upload/cleanup` | POST maintenance cleanup berautentikasi |

Endpoint session, CSRF, dan signout adalah subpath handler Auth.js, bukan halaman UI tersendiri.
