# Database Architecture

Sumber struktur adalah `prisma/schema.prisma`. Provider PostgreSQL; Prisma ORM 7 memakai generator prisma-client dengan output `src/generated/prisma`. `prisma.config.ts` menentukan lokasi schema/migration dan sumber koneksi melalui DATABASE_URL. `src/lib/prisma.ts` memakai PrismaPg dan reuse client pada development. URL koneksi dan data akun tidak dicantumkan.

## Model aktual

| Model | Fungsi dan field penting |
|---|---|
| User | Akun administrator: name, email unique, passwordHash, role, isActive, sessionVersion, timestamp |
| News | Berita: title, slug unique, category, excerpt/content, imageUrl, status, publishedAt, eventDate, authorId; reviewStatus/reviewerId/reviewedAt/reviewNote/contentVersion dan pendingRevision legacy |
| Event | Agenda: slug unique, category, description, startDate/endDate, location/linkUrl/imageUrl, status, authorId, timestamp |
| Publication | Publikasi: title, type, description, externalUrl/fileUrl, publishedAt, timestamp |
| MemberProfile | Direktori anggota terpisah dari User: email unique, institutionId opsional, photoUrl/detailUrl, nidn, position, fieldOfExpertise, emailPublic, profil akademik, timestamp |
| University | Kampus: name unique, slug opsional unique, shortName, address, deptUrl/websiteUrl/logoUrl, description, timestamp |
| ManagementPeriod | Periode: period unique, isActive default false, createdAt |
| ManagementPosition | Jabatan: periodId wajib, memberProfileId opsional, title, department, order, createdAt |
| Gallery | Media: title, mediaType, mediaUrl, category, description, isFeatured, sortOrder, timestamp |
| ContentChange | Ownership dan proposal central: kind/targetId, operation, payload/before JSON, baseHash, authorId/submittedById/reviewerId, reviewStatus/contentVersion, catatan/waktu review, timestamp |

User tidak berelasi langsung dengan MemberProfile. Tidak ada model kontak, dokumen, token reset password, atau akun pengunjung pada schema saat ini. Event dan Publication tidak memiliki kolom reviewStatus/contentVersion sendiri; metadata approval lintas modul berada di ContentChange. Publication tidak memiliki kolom status atau authorId canonical.

## Relasi dan penghapusan

| FK | Target | Perilaku penting |
|---|---|---|
| News.authorId, Event.authorId | User.id | Relasi wajib; schema tidak menetapkan onDelete eksplisit, sehingga mengikuti default Prisma untuk relasi wajib |
| News.reviewerId | User.id | Restrict pada delete, Cascade pada update |
| ContentChange.authorId/submittedById/reviewerId | User.id | Restrict pada delete, Cascade pada update |
| MemberProfile.institutionId | University.id | SetNull saat kampus dihapus |
| ManagementPosition.periodId | ManagementPeriod.id | Cascade saat periode dihapus |
| ManagementPosition.memberProfileId | MemberProfile.id | SetNull saat anggota dihapus |

ContentChange.targetId adalah string polimorfik, bukan FK ke delapan model konten. Constraint unique(kind,targetId) membatasi satu metadata/proposal per item, tetapi tidak memvalidasi keberadaan target. CREATE dapat belum mempunyai canonical; record metadata dapat bertahan setelah DELETE. Validasi target dan penerapan canonical ditangani aplikasi dalam transaksi.

## Enum, indeks, dan default

Role: SUPER_ADMIN/ADMIN. ContentStatus: DRAFT/PUBLISHED/ARCHIVED. ReviewStatus: DRAFT/PENDING_REVIEW/REVISION_REQUIRED/APPROVED. ContentModule dan ChangeOperation menentukan tipe serta operasi proposal. Enum domain lain adalah NewsCategory, EventCategory, PublicationType, dan MediaType.

Indeks tambahan: MemberProfile.fieldOfExpertise; News(category,status); Event(startDate,category); ContentChange(reviewStatus,updatedAt) dan (authorId,reviewStatus). Unique email/slug/nama/periode mengikuti deklarasi tiap model. id memakai String dengan default cuid client-side; jalur submitContent juga dapat memasukkan UUID eksplisit. Field JSON tersimpan sebagai JSON PostgreSQL sesuai mapping Prisma.

isActive periode bukan unique constraint database. applyContent memeriksa konsistensi jumlah periode aktif dan menonaktifkan periode lain dalam transaksi ketika mengaktifkan target. Guard aplikasi melarang menghapus kampus yang masih memiliki anggota walaupun FK schema secara teknis mengizinkan SetNull.

## Mutation dan integritas

Server Actions konten -> content-approval -> content-records -> Prisma transaction. Serializable, pemeriksaan versi canonical/proposal, FK, unique constraint, dan validasi input bekerja bersama. Transaksi media memakai advisory lock dan hanya membersihkan file setelah commit; metadata file berada di filesystem, bukan database.

User.sessionVersion adalah counter pencabutan sesi. News.contentVersion dan ContentChange.contentVersion meningkat pada mutation terkait. Timestamp @updatedAt dipelihara Prisma; bukan jaminan otomatis untuk SQL di luar aplikasi. ManagementPeriod/Position tidak memiliki updatedAt, sehingga concurrency memakai fingerprint field existing. Detail aturan di [../backend/AUTH_AND_WORKFLOW.md](../backend/AUTH_AND_WORKFLOW.md).

Schema menyatakan struktur yang diinginkan aplikasi, bukan bukti bahwa semua database deployment identik. Perbandingan history dijelaskan di [MIGRATIONS.md](MIGRATIONS.md).
