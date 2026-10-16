# Pola Implementasi UI Existing

## Form dan Server Actions

Form CMS memakai state terkontrol, tipe input dari action, dan validasi HTML seperti required, maxLength, tipe email, serta pemeriksaan ukuran/jenis upload. Validasi authoritative tetap di server melalui `normalizeContent()` dan helper domain. Input URL dan rich text mempunyai aturan server tersendiri; validasi UI tidak memberikan authorization.

Form edit menyimpan expected version awal bersama draft. Token tidak diambil ulang saat tombol simpan ditekan. Mutation UPDATE/DELETE, toggle, dan aktivasi meneruskan token melalui action existing. Pesan konflik server tampil sebagai error; data tidak dianggap tersimpan ketika hasil gagal.

## Feedback dan error

Setelah hasil berhasil, form mengarahkan ke listing dengan `?result=saved` atau ke `/admin/submissions?result=submitted` bila pending. Delete memakai `deleted`, perubahan status memakai `status-updated`. Review memakai `approved`, `rejected`, atau `resubmitted`; banner berada di luar item queue yang dapat hilang.

`router.refresh()` mempertahankan pengambilan ulang data existing. Pesan URL adalah feedback navigasi, bukan bukti mutation baru ketika URL dibuka ulang. `ContentFeedback` hanya menerima kode yang dikenal. Respons bisnis `success: false` dipisahkan dari kegagalan transport. Lima komponen Member/University/Gallery/Management/ManagementPosition Actions menangkap rejection dan respons tidak valid; pesan meminta pemeriksaan data terbaru sebelum retry manual. Tidak ada retry mutation otomatis pada handler tersebut.

## Dialog dan tindakan sensitif

Member delete, University delete, Gallery preview/delete memakai native `dialog.showModal()` melalui hook bersama: background inert, fokus awal ke tutup/batal, Escape diblokir ketika pending, dan fokus dikembalikan jika pemicu masih ada. Kontrol tutup/batal dinonaktifkan selama mutation.

Persetujuan penghapusan dan perubahan role/status/reset password akun existing memiliki dialog konfirmasi inline. Cancel tidak memanggil mutation. Simpan nama/email biasa tidak membutuhkan konfirmasi sensitif. Konfirmasi cascade menyebut posisi yang ikut terhapus. Perilaku native modal pada empat dialog tadi tidak dapat diasumsikan berlaku pada seluruh dialog inline lainnya.

## Pagination, pencarian, filter

Listing News, Event, Member, University, Publication, Gallery, ManagementPeriod, dan ManagementPosition memakai query server dengan take/skip 20, count sesuai filter/ownership, dan id sebagai tie-breaker sorting. Parameter halaman tidak valid kembali ke halaman pertama; halaman terlalu besar dibatasi ke jumlah halaman hasil count.

`AdminPagination` mempertahankan parameter filter, memakai pageKey existing, dan menghapus result dari tautan navigasi. Bila hanya satu halaman, tidak ada area pagination atau teks jumlah data. Queue review mempunyai navigasi sendiri di `ContentReviewQueue`.

Pengelolaan periode mempertahankan snapshot scalar semua posisi untuk token concurrency; daftar tampilan posisi beserta join dipaginasi terpisah. Metadata versi dan opsi pilihan pada form/filter tidak seluruhnya dipaginasi.

## Konvensi source

Komponen memakai PascalCase; file route mengikuti page.tsx/layout.tsx/route.ts. Hook existing memakai use-kebab-case di `src/lib/`. URL domain mengikuti nama folder bahasa Inggris. Style memakai utility Tailwind dan token di globals.css; props typed memisahkan server data dari interaksi client. Skeleton area ada di loading.tsx; listing menyediakan empty state.
