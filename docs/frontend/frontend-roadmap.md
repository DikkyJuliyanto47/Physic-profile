# Indeks Alur Frontend Terimplementasi

Nama file existing dipertahankan agar tautan dokumentasi tetap valid. Isinya hanya merangkum alur yang sudah ada; rincian disediakan oleh dokumen yang ditautkan.

| Alur | Source utama | Dokumentasi |
|---|---|---|
| Membaca halaman publik | `src/app/(public)/`, `src/lib/data.ts` | [Arsitektur](architecture.md) dan [routing](routing.md) |
| Login dan membuka dashboard | `src/app/(admin)/login/page.tsx`, `AdminLayoutClient.tsx` | [Auth dan workflow](../backend/AUTH_AND_WORKFLOW.md) |
| Mengirim form/mutation konten | `src/components/admin/`, `src/actions/` | [Pola UI](development-guidelines.md) |
| Meninjau dan merevisi pengajuan | `ContentReviewQueue.tsx`, `ContentReviewControls.tsx` | [Auth dan workflow](../backend/AUTH_AND_WORKFLOW.md) |
| Mengelola akun admin | `AdminAccounts.tsx`, `src/actions/admin.ts` | [Arsitektur komponen](component-architecture.md) |
| Menampilkan media | `GalleryActions.tsx`, `src/app/api/upload/` | [Backend](../backend/README.md) |
