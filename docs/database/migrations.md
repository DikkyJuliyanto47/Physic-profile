# Sistem Migration

## Struktur repository

`prisma.config.ts` menunjuk `prisma/schema.prisma` dan `prisma/migrations`. File `migration_lock.toml` menetapkan provider PostgreSQL. Tiap folder bertimestamp mempunyai migration.sql.

| Migration yang tersedia | Isi berdasarkan SQL |
|---|---|
| 20260831000000_baseline | Schema public, enum awal, model canonical, indeks, dan FK |
| 20260901113430_final_verification | Migration kosong |
| 20261011000000_admin_session_version | Penambahan User.sessionVersion |
| 20261013000000_news_event_date | Penambahan News.eventDate |
| 20261016000000_central_content_approval | Enum approval, metadata News, ContentChange, indeks/FK, backfill dan ownership legacy |

## Schema dan history

schema.prisma dipakai untuk generate client dan mendefinisikan model aplikasi. migration.sql adalah perubahan SQL berurutan. PostgreSQL menyimpan history penerapan Prisma di _prisma_migrations, termasuk nama, checksum, waktu mulai/selesai, status rollback, serta applied_steps_count. Folder yang tersedia tidak membuktikan migration sudah dijalankan; objek yang sudah ada juga tidak membuktikan cara objek itu dipasang.

Dalam mekanisme Prisma, migrate status membaca perbandingan file/history; migrate deploy menerapkan migration pending. Mencatat migration sebagai applied melalui resolve berbeda dari mengeksekusi SQL. Dokumentasi ini tidak menjalankan perintah migration, reset, seed, introspeksi, maupun pengujian database.

## Approval pada repository aktual

Migration central ditujukan ke baseline sebelum approval. SQL berjalan dalam BEGIN/COMMIT, memakai search_path public, lock_timeout 5 detik, statement_timeout 60 detik, serta lock tabel konten. Precondition menolak history gagal, migration approval legacy yang sudah berjalan, objek approval yang sudah ada/parsial, snapshot News lama, baseline yang kurang, ketiadaan reviewer aktif, dan custom trigger News.

SQL membuat ReviewStatus, ContentModule, ChangeOperation, field review News dan pendingRevision, lalu ContentChange. News PUBLISHED diberi metadata APPROVED tanpa mengganti konten/tanggal canonical. Ownership News/Event legacy diimpor sebagai metadata APPROVED dengan authorId existing; reviewer dan waktu historis tidak diciptakan. Modul legacy lainnya tidak diberi pemilik tebakan.

Folder 20261015000000_content_approval_foundation dan 20261015010000_approval_activation_legacy tidak ada lagi dalam rantai repository. Central masih menyebut kedua nama tersebut dalam guard dan komentar. Komentar juga merujuk prisma/CONTENT_APPROVAL_ACTIVATION.md yang tidak tersedia. Ini adalah kondisi source, bukan instruksi untuk menjalankan ulang central pada database yang sudah berisi approval. Migration central tidak idempotent dan sengaja menolak objek existing.

## Catatan database existing yang pernah diverifikasi

Pada pemeriksaan read-only dalam sesi pemeliharaan 16 Oktober 2026, central tercatat selesai dengan applied_steps_count 0; checksum saat itu cocok dengan file repository. Kedua nama migration approval legacy tidak tercatat; ContentChange dan field review News tersedia, sementara field approval legacy Event/Publication tidak ditemukan. Angka 0 tidak membuktikan SQL dijalankan oleh Prisma; metode pemasangan awal tidak dapat disimpulkan dari catatan itu saja.

Pemeriksaan tersebut juga menemukan record 20260928000000_normalize_image_urls di database, tetapi folder SQL-nya tidak tersedia dalam repository saat dokumentasi ini disusun. Isi SQL/checksum file aslinya tidak dapat diverifikasi dari source yang tersedia. Dengan demikian history file dan database tidak dapat dinyatakan sepenuhnya sinkron.

Status di atas adalah hasil pembacaan sebelumnya, bukan pemeriksaan live pada tugas dokumentasi ini dan bukan jaminan untuk environment lain. Tidak ada perubahan history/database yang dilakukan untuk menyusun dokumen ini.
