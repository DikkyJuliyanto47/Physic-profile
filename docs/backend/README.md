# Backend Architecture

Backend berada dalam aplikasi Next.js App Router yang sama dengan frontend. Mutation CMS memakai Server Actions, bukan API CRUD terpisah untuk setiap model. Route HTTP khusus dipakai untuk Auth.js dan upload. Konfigurasi dependency aktual ada di `package.json`.

## Struktur dan tanggung jawab

| Path | Fungsi |
|---|---|
| `src/actions/{news,event,member,university,publication,gallery,management}.ts` | Entry point typed `"use server"`, mendelegasikan mutation ke submitContent |
| `src/actions/content-review.ts` | Review dan pengajuan ulang melalui helper approval |
| `src/actions/admin.ts` | Validasi dan mutation akun administrator |
| `src/lib/content-approval.ts` | Guard, ownership, versi, transaksi pengajuan/review, hasil dan invalidasi cache |
| `src/lib/content-fields.ts`, `content-workflow.ts` | Normalisasi field, validasi domain, aturan transisi dan versi |
| `src/lib/content-records.ts` | Snapshot canonical dan penerapan create/update/delete per model |
| `src/lib/prisma.ts` | PrismaClient dengan adapter PostgreSQL |
| `src/lib/data.ts` | Query publik, cache/tag, mapping presentasi, sanitasi rich text |
| `src/lib/media-lifecycle.ts` | Penyimpanan dan penghapusan media terkelola |
| `src/app/api/` | Auth handler, upload, release, dan maintenance cleanup |

## Alur mutation

1. Form/action client mengirim input dan expected version untuk target existing.
2. Entry point memanggil helper existing. Konten menjalankan requireAdmin dan pemeriksaan kesiapan approval; review memerlukan requireSuperAdmin.
3. Dalam transaksi media Serializable, akun diperiksa ulang, canonical/proposal dibaca, versi dan ownership diverifikasi, lalu input dinormalisasi.
4. Admin membuat/mengganti proposal; Admin PSI Surabaya dapat menerapkan perubahan langsung. Penerapan canonical ditangani applyContent.
5. Setelah commit, cleanup media dijalankan sinkron. Kegagalan cleanup dicatat terpisah dan tidak mengubah mutation sukses menjadi gagal.
6. Tag data domain di-update dan layout di-revalidate. Hasil dikembalikan sebagai success/error/pending/requestId; frontend menentukan feedback/navigasi.

Detail state dan authorization ada di [AUTH_AND_WORKFLOW.md](AUTH_AND_WORKFLOW.md). Model/relasi ada di [../database/README.md](../database/README.md).

## Validasi dan error

Normalisasi memeriksa tipe, field wajib, enum, panjang, tanggal, URL/media, referensi, dan angka sesuai domain. News eventDate memiliki helper tersendiri. Toggle status diselesaikan dari canonical di dalam transaksi; tidak hanya mempercayai status browser.

ContentWorkflowError dikembalikan sebagai pesan bisnis. Helper memetakan kode Prisma: P2021/P2022 menjadi approval unavailable; P2002 menjadi konflik unique; P2003/P2025 menjadi masalah referensi/record; P2034 menjadi konflik transaksi bersamaan. Exception lain dicatat dan menjadi pesan umum. Handler client membedakan response gagal dari rejection transport pada jalur yang memiliki try/catch. Tidak ada klaim bahwa semua handler memiliki implementasi identik.

## Upload dan media lifecycle

POST `/api/upload` memerlukan requireAdmin, multipart file, ukuran > 0 sampai 1 MiB, MIME/ekstensi PNG/JPEG/WebP yang cocok, serta signature byte gambar yang valid. URL hasil berada di `/uploads/news/`, nama UUID, file fisik di `public/uploads/news/`. Metadata pemilik/releasedAt/deletedAt disimpan di `.media-lifecycle/`, bukan tabel database.

Helper memeriksa direktori/file terhadap symlink dan hardlink yang tidak aman, memakai lock direktori storage dan advisory transaction lock PostgreSQL (key 14014). Tombstone metadata mencegah URL yang sudah dihapus disimpan kembali sebagai managed media.

mutateWithMedia mengumpulkan kandidat dari snapshot sebelum mutation. Sesudah commit, kandidat ditandai released, kemudian cleanup memeriksa referensi sebelum unlink. referencedIds membaca kolom URL/rich text pada News, Event, MemberProfile, University, Publication, Gallery serta News.pendingRevision dan ContentChange.payload/before. Tabel User dan Management tidak diserialisasi untuk pencarian media. Referensi terenkode didekode secara konservatif; referensi ambigu atau storage proposal belum tersedia menahan penghapusan.

DELETE `/api/upload` hanya menandai release URL milik uploader, maksimal 50 URL per request. cleanupReleasedUploads memproses release berumur minimal 24 jam. Pemicu existing adalah POST upload secara oportunistik dan POST `/api/upload/cleanup` berautentikasi. Tidak ada worker/scheduler yang dijalankan oleh helper ini. Cleanup tetap sinkron dan berada dalam lock; pemindaian kolom relevan masih membaca seluruh baris.

Penghapusan fisik aktif pada development atau ketika MEDIA_SHARED_STORAGE bernilai true. Kondisi produksi tersebut menyatakan semua writer menggunakan volume bersama dan lifecycle yang sama; source tidak membuktikan konfigurasi infrastruktur deployment. File legacy tanpa metadata kepemilikan tidak dihapus sebagai kandidat managed.
