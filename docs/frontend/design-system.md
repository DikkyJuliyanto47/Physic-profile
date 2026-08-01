# Design System Foundation

Dokumen ini mendokumentasikan fondasi design system berdasarkan arah visual
yang telah ditetapkan oleh design owner. Desain UI/UX yang sudah dibuat
adalah **source of truth** — dokumen ini tidak menciptakan keputusan visual
baru, hanya mencatat arah yang sudah disepakati dan menandai yang belum
ditentukan sebagai **TBD**.

## 1. Color System

Arah warna yang sudah ditetapkan:

| Peran | Warna | Nilai Token |
|---|---|---|
| Primary | Biru | TBD |
| Neutral | Putih | TBD |
| Neutral | Abu-abu | TBD |
| Supporting colors | Sesuai kebutuhan halaman | TBD |

Nilai hex/token final menunggu spesifikasi resmi dari design owner. Frontend
tidak menetapkan nilai warna sendiri untuk menghindari ketidaksesuaian dengan
desain final.

## 2. Typography

| Elemen | Ketentuan |
|---|---|
| Font family | TBD |
| Heading scale (H1–H6) | TBD |
| Body text size | TBD |
| Font weight | TBD |

Karakter tipografi yang diharapkan: profesional, modern, mudah dibaca, sesuai
konteks organisasi akademik/ilmiah.

## 3. Spacing

Skala spacing mengikuti satuan Tailwind CSS default sebagai baseline
sementara nilai kustom belum ditentukan.

| Kebutuhan | Status |
|---|---|
| Skala spacing kustom (jika ada) | TBD |
| Spacing antar section halaman | TBD |

## 4. Border Radius

| Elemen | Status |
|---|---|
| Radius komponen (button, card, input) | TBD |

## 5. Shadows

| Elemen | Status |
|---|---|
| Elevation/shadow style untuk card, dropdown, modal | TBD |

## 6. Responsive Breakpoints

Baseline sementara mengikuti breakpoint default Tailwind CSS 4, sampai ada
kebutuhan kustom dari desain:

| Breakpoint | Referensi Default Tailwind |
|---|---|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

Perubahan breakpoint kustom (jika diperlukan desain): **TBD**.

## 7. Button Style

| Aspek | Status |
|---|---|
| Variant (primary, secondary, outline, ghost, dst.) | TBD |
| Size scale | TBD |
| State (hover, disabled, loading) | TBD |

## 8. Card Style

| Aspek | Status |
|---|---|
| Padding, radius, shadow | TBD |
| Variant untuk konten berbeda (berita, anggota, agenda) | TBD |

## 9. Form Style

| Aspek | Status |
|---|---|
| Style input, select, textarea | TBD |
| Style validasi error/success | TBD |

## 10. Navigation Style

| Aspek | Status |
|---|---|
| Public Navbar (desktop & mobile) | TBD |
| Admin Sidebar | TBD |

## 11. Section Style

| Aspek | Status |
|---|---|
| Pola spacing antar section landing page | TBD |
| Pola container/max-width halaman | TBD |

## 12. Prinsip Penggunaan

- Semua nilai bertanda **TBD** wajib diisi berdasarkan desain resmi sebelum
  diimplementasikan sebagai Tailwind config atau design token — bukan
  ditentukan sendiri oleh developer saat coding.
- Setelah nilai final tersedia, dokumen ini wajib diperbarui sebagai acuan
  tunggal design token, agar tidak terjadi duplikasi keputusan visual di
  beberapa tempat.
