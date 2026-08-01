# Frontend Roadmap

Dokumen ini menjelaskan tahapan implementasi frontend secara bertahap.
Roadmap ini adalah rencana, bukan implementasi — setiap phase dieksekusi
sebagai task terpisah setelah phase sebelumnya selesai dan disetujui.

## Phase 1 — Frontend Foundation

**Tujuan:** memastikan struktur dasar repository dan dokumentasi siap
menjadi acuan sebelum coding UI dimulai.

**Scope:** audit struktur existing, penetapan struktur folder
(`components/`, `actions/`, dst.), dokumentasi arsitektur dan routing
konseptual. Tidak ada UI yang dibuat pada phase ini.

## Phase 2 — Design System

**Tujuan:** menerjemahkan desain UI/UX resmi menjadi design token yang siap
dipakai di Tailwind config.

**Scope:** finalisasi warna, tipografi, spacing, radius, shadow, dan
breakpoint berdasarkan file desain resmi (mengisi seluruh status TBD di
`design-system.md`). Belum membangun komponen.

## Phase 3 — Global Layout

**Tujuan:** membangun kerangka visual yang dipakai di seluruh halaman.

**Scope:** implementasi `PublicNavbar`, `PublicFooter`, `AdminSidebar`,
`AdminHeader`, dan `Container` di `components/layout/`, serta pemasangan ke
`(public)/layout.tsx` dan `(admin)/admin/layout.tsx`. Konten halaman belum
diisi.

## Phase 4 — Public Landing Page

**Tujuan:** implementasi halaman `/` sesuai konsep desain (Navbar, Hero,
Berita Terbaru, Tentang PSI, Statistik Organisasi, Galeri, Agenda Terdekat,
Anggota PSI, Perguruan Tinggi Anggota, CTA Bergabung, Footer).

**Scope:** UI landing page dengan data statis/placeholder terlebih dahulu.
Integrasi data dinamis dilakukan di phase integrasi (Phase 8).

## Phase 5 — Public Website Pages

**Tujuan:** melengkapi seluruh halaman Public Website selain landing page.

**Scope:** `/tentang`, `/kepengurusan`, `/anggota`, `/perguruan-tinggi`,
`/akademik`, `/riset-publikasi`, `/berita`, `/agenda`, `/galeri`, `/kontak`.
Setiap halaman dibangun dengan komponen dari `features/` yang sesuai
domainnya.

## Phase 6 — Admin Panel UI Foundation

**Tujuan:** menyiapkan kerangka visual Admin Panel sebelum fitur CRUD
dibangun.

**Scope:** struktur dasar dashboard, navigasi sidebar per domain, pola
tabel/list generik di `components/ui/`. Belum ada CRUD atau autentikasi.

## Phase 7 — Admin Panel Pages

**Tujuan:** membangun halaman manajemen konten per domain.

**Scope:** UI untuk manajemen Berita, Agenda, Anggota, Perguruan Tinggi,
Kepengurusan, Publikasi, dan Galeri. Form menggunakan komponen dari
`components/forms/`. Business logic dan autentikasi tetap di luar scope
frontend murni — dikoordinasikan dengan integration boundary saat
dibutuhkan.

## Phase 8 — Frontend Integration

**Tujuan:** menghubungkan UI yang sudah dibangun dengan data nyata melalui
integration boundary (`actions/`, `server/`, dst.).

**Scope:** mengganti data statis/placeholder dengan data dari layer backend,
menambahkan loading/empty/error state sesuai `development-guidelines.md`.
Detail teknis integrasi didokumentasikan terpisah di luar dokumentasi
frontend ini.

## Catatan

Roadmap ini bersifat sekuensial secara konsep, namun eksekusi tiap phase
tetap disesuaikan dengan prioritas project berjalan. Tidak ada estimasi
waktu yang ditetapkan di dokumen ini karena berada di luar scope
dokumentasi arsitektur frontend.
