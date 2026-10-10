# Product Requirements Document (PRD)

## 1. Project Overview

Website Physical Society of Indonesia (PSI) Cabang Surabaya menyediakan informasi organisasi dan kegiatan fisika kepada publik, serta dashboard internal untuk mengelola konten organisasi. Aplikasi menggabungkan website publik dan CMS dalam satu aplikasi Next.js; data terstruktur disimpan di PostgreSQL.

## 2. Product Objectives

- Menyediakan satu tempat untuk melihat profil PSI Surabaya, anggota, perguruan tinggi, kepengurusan, berita, agenda, galeri, dan publikasi.
- Memungkinkan administrator memperbarui konten yang ditampilkan kepada publik tanpa mengedit source untuk setiap perubahan.
- Menjaga pemisahan area publik dan administrasi serta membatasi operasi pengelolaan kepada admin yang terautentikasi.

## 3. Target Users & Roles

| Aktor | Akses dan kebutuhan |
|---|---|
| Pengunjung publik | Melihat informasi organisasi, direktori, berita, agenda, galeri, serta publikasi. Tidak memerlukan akun. |
| Administrator | Login ke dashboard untuk mengelola konten CMS. Akun menggunakan role `ADMIN` atau `SUPER_ADMIN`; keduanya saat ini memperoleh akses admin yang sama. |

Tidak ditemukan alur registrasi publik atau akun anggota yang terhubung dengan profil anggota.

## 4. Features & Functional Requirements

### Website publik

| Modul | Fungsi dan perilaku utama | Akses |
|---|---|---|
| Beranda | Menampilkan pengenalan, statistik, berita terbaru, agenda, perguruan tinggi, CTA, dan galeri berbasis aset lokal. Sebagian data beranda dibaca dari database. | Semua pengunjung |
| Profil organisasi | Menyajikan informasi, sejarah, visi, dan misi PSI Surabaya. | Semua pengunjung |
| Berita | Menampilkan daftar dan detail berita yang berstatus `PUBLISHED`. | Semua pengunjung |
| Agenda | Menampilkan daftar dan detail agenda yang berstatus `PUBLISHED`. | Semua pengunjung |
| Anggota dan kepengurusan | Menampilkan direktori anggota serta kepengurusan pada periode aktif. | Semua pengunjung |
| Perguruan tinggi | Menampilkan daftar perguruan tinggi dan detail beserta anggota terkait. | Semua pengunjung |
| Riset dan publikasi | Menampilkan publikasi yang tanggal terbitnya tersedia dan tidak berada di masa depan; tautan dapat menuju sumber eksternal atau berkas bila datanya tersedia. | Semua pengunjung |
| Galeri | Menampilkan item galeri yang tersimpan di database. | Semua pengunjung |
| Kontak | Menyajikan kanal kontak, wilayah, dan informasi lokasi. Halaman ini tidak mengirim pesan melalui form. | Semua pengunjung |

### Dashboard admin

| Modul | Fungsi dan perilaku utama | Akses |
|---|---|---|
| Autentikasi | Memvalidasi kredensial terhadap akun aktif di database dan membuat session JWT. | Administrator |
| Dashboard | Menampilkan ringkasan dan shortcut pengelolaan. Komponen ringkasan pesan tidak didukung model inbox pada schema saat ini. | Administrator |
| Berita dan agenda | Membuat, mengubah, menghapus, dan mengelola status konten. Berita dan agenda yang dipublikasikan dapat ditampilkan di website publik. | Administrator |
| Anggota dan perguruan tinggi | Mengelola profil anggota dan data institusi. Profil anggota bukan akun login. | Administrator |
| Kepengurusan | Mengelola periode, memilih periode aktif, serta mengatur jabatan, departemen, anggota, dan urutan. | Administrator |
| Publikasi | Membuat, mengubah, dan menghapus publikasi serta mengelola tipe, deskripsi, tanggal, dan tautan eksternal. | Administrator |
| Galeri | Mengelola item, jenis media, kategori, urutan, dan status unggulan. | Administrator |
| Upload gambar | Mengunggah gambar untuk konten melalui endpoint terproteksi; format PNG, JPEG, dan WebP dengan batas ukuran 1 MiB. | Administrator |

## 5. Main User Flows

1. **Pengunjung mencari informasi:** membuka halaman publik, memilih modul atau detail konten, lalu mengikuti tautan ke profil institusi atau sumber publikasi jika tersedia.
2. **Admin login:** memasukkan email dan password pada `/login`; server memeriksa akun aktif dan hash password, lalu membuat session. Route admin dan operasi mutasi memerlukan role admin yang diterima aplikasi.
3. **Admin mengelola konten:** membuka modul dashboard, membuat atau memperbarui data melalui form, dan menyimpan perubahan ke PostgreSQL melalui Server Actions.
4. **Konten tampil ke publik:** berita dan agenda berstatus `PUBLISHED` tersedia di halaman publik; pembaruan memicu invalidasi cache/tag atau route sesuai implementasi modul. Visibilitas modul lain mengikuti query publik masing-masing.

## 6. Non-Functional Requirements

| Area | Harapan produk | Implementasi yang tersedia |
|---|---|---|
| Security | Area administrasi dan operasi tulis hanya dapat digunakan admin; password tidak disimpan sebagai teks biasa. | Credentials authentication, bcrypt comparison, JWT session, guard pada layout/Server Actions, dan otorisasi upload tersedia. Ini bukan pernyataan bahwa keamanan telah diverifikasi menyeluruh; lihat backlog pada `TODO.md`. |
| Performance | Halaman publik sebaiknya responsif dan membatasi query berulang. | Sebagian pembaca data memakai Next.js Cache Components dengan cache profile `hours`; sejumlah halaman masih melakukan query langsung. |
| Reliability | Perubahan konten tercermin dengan benar, serta kegagalan dapat diketahui pengguna/admin. | Server Actions mengembalikan status berhasil/gagal dan sebagian memicu revalidation. Pengujian operasional dan cakupan penanganan error tidak dinyatakan terverifikasi. |
| Accessibility | Navigasi, form, fokus keyboard, dan konten memiliki struktur yang dapat digunakan beragam pengguna. | Beberapa komponen memakai elemen semantik, label, dan `focus-visible`; konsistensi aksesibilitas belum dinyatakan telah diaudit. |
| Maintainability | Domain, route, dan UI terorganisasi sehingga perubahan dapat ditelusuri. | Source dipisah ke route, actions, data helpers, feature components, UI, dan schema. |
| Responsive design | Website dan dashboard tetap dapat digunakan pada viewport kecil dan besar. | Implementasi memakai utility responsive Tailwind dan navigasi mobile; hasil visual lintas perangkat belum dinyatakan tervalidasi. |

## 7. Scope & Limitations

- Produk mencakup situs informasi publik dan CMS untuk modul yang disebutkan; tidak ditemukan modul akun anggota, pendaftaran anggota, manajemen akun admin, atau workflow approval.
- Form lupa/reset password hanya menyediakan interaksi UI; tidak ditemukan layanan pengiriman email atau penyimpanan token reset.
- Halaman kontak menampilkan informasi dan tautan kontak, bukan form pesan yang menyimpan ke backend. Schema tidak memiliki model pesan kontak.
- Carousel galeri di beranda memakai data/aset lokal dan terpisah dari galeri CMS; halaman galeri publik mengambil data database.
- Upload aplikasi saat ini berupa file gambar pada filesystem lokal di bawah `public/uploads/news`; bukan layanan object storage eksternal.
- Pengelolaan publikasi berfokus pada tautan eksternal; walaupun schema memiliki `fileUrl`, alur admin yang ditelusuri tidak mengelola upload berkas publikasi.
- Fitur dan temuan maintenance yang perlu ditindaklanjuti dirujuk pada `TODO.md`; dokumen ini tidak menyalin daftar audit tersebut.

## 8. Current Development Status

Project berada pada tahap maintenance dan debugging. PRD ini mencatat kemampuan yang terlihat pada source saat ini, bukan proposal fitur baru. Backlog audit dan verifikasi lanjutan dirujuk pada `TODO.md`.
