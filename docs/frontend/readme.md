# Frontend PSI Surabaya

Dokumentasi ini menjelaskan implementasi di repository, bukan rancangan fitur. Aplikasi memakai Next.js App Router 16.2.12, React 19.2.4, TypeScript, dan Tailwind CSS 4; deklarasi dependency berada di `package.json`.

## Peta dokumen

| Dokumen | Isi |
|---|---|
| [architecture.md](architecture.md) | Rendering, layout, data, dan batas client/server |
| [routing.md](routing.md) | URL publik, admin, dan endpoint pendukung |
| [component-architecture.md](component-architecture.md) | Komponen utama dan tanggung jawabnya |
| [design-system.md](design-system.md) | Token CSS dan primitive visual existing |
| [development-guidelines.md](development-guidelines.md) | Pola form, feedback, dialog, dan pagination yang dipakai |
| [frontend-roadmap.md](frontend-roadmap.md) | Indeks alur frontend yang sudah diimplementasikan; nama file existing dipertahankan |

Backend dijelaskan di [../backend/README.md](../backend/README.md), autentikasi/workflow di [../backend/AUTH_AND_WORKFLOW.md](../backend/AUTH_AND_WORKFLOW.md), dan model di [../database/README.md](../database/README.md).

Area publik membaca konten canonical. Dashboard menyediakan pengelolaan konten, pengajuan, review, dan akun admin. Tidak ada registrasi akun pengunjung. Nama akun berasal dari `User.name`; label `SUPER_ADMIN` adalah **Admin PSI Surabaya**, sedangkan `ADMIN` adalah **Admin**.
