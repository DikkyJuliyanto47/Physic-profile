# Arsitektur Komponen

## Direktori existing

| Path | Tanggung jawab dan contoh |
|---|---|
| `src/components/ui/` | Primitive: Button, Card, Badge, Container, Section, SectionHeading; juga PageHeader, PageBreadcrumb, PublicPageShell, PersonCard, ShareActions |
| `src/components/layout/` | PublicNavbar, PublicMobileNav, PublicFooter, BrandMark, AdminSidebar, AdminTopbar |
| `src/components/features/` | Komposisi domain publik: home, news, events, members, universities, management, research, gallery, contact |
| `src/components/admin/` | Form konten, kontrol mutation, akun, queue review, feedback, dan pagination |
| `src/components/forms/` | Direktori form existing; form CMS aktif berada di `components/admin/` |
| `src/components/seo/` | Keluaran SEO seperti JsonLd |

Halaman di `src/app/` mengomposisi komponen dan data. Primitive visual tidak menjalankan mutation domain. Query server publik terpusat terutama di `src/lib/data.ts`; halaman admin dapat membaca Prisma langsung setelah guard.

## Komponen CMS utama

- `*Form.tsx`: satu implementasi create/edit per domain, state input, upload bila relevan, error, dan navigasi setelah Server Action.
- `*Actions.tsx`: edit, konfirmasi delete, toggle News/Event, dan aktivasi periode. Kontrol meneruskan token versi yang diterima dari halaman server.
- `ContentReviewQueue.tsx`: query/filter/pagination pengajuan, nama pemilik/pengaju/reviewer, snapshot sebelum perubahan, dan komposisi kontrol client.
- `ContentReviewControls.tsx`: review, alasan penolakan, revisi, dan konfirmasi persetujuan penghapusan termasuk cascade periode.
- `AdminAccounts.tsx`: nama/email/role/status/password; konfirmasi khusus perubahan sensitif akun existing dan signout bila sesi sendiri dicabut.
- `ContentFeedback.tsx`: pemetaan `result` URL ke pesan sukses/pending yang dikenal.
- `AdminPagination.tsx`: kontrol Sebelumnya/Berikutnya, tersembunyi jika hanya satu halaman; page size 20.

Topbar mempertahankan nama akun dari session dengan fallback User/U. Label role tidak menggantikan nama akun di daftar akun maupun identitas pada review queue.

## Hook UI yang dipakai

`src/lib/use-upload-lifecycle.ts` melacak URL upload dan mengirim release untuk media yang ditinggalkan. `src/lib/use-dialog-accessibility.ts` dipakai MemberActions, UniversityActions, dan dua dialog GalleryActions: native modal, fokus awal, Escape aman, dan pengembalian fokus. Dialog lain masih memiliki implementasi inline masing-masing; hook ini tidak dipakai secara global.
