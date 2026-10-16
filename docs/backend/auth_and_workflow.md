# Authentication dan Content Workflow

## Login, session, logout

`src/auth.ts` membuat konfigurasi NextAuth v5/Auth.js dengan credentials dan strategi JWT, maxAge 8 jam. authorize mencari User berdasarkan email, memeriksa isActive, dan membandingkan password menggunakan bcrypt. Hasil login membawa id, name, email, role, dan sessionVersion. AUTH_SECRET adalah nama konfigurasi secret; nilainya tidak dicantumkan di dokumentasi.

`src/auth.config.ts` memetakan id/role/sessionVersion JWT ke session dan menyediakan authorized callback. Nama session berasal dari nama akun saat login; perubahan User.name tidak otomatis memperbarui JWT yang sudah diterbitkan. `src/app/api/auth/[...nextauth]/route.ts` mengekspor GET/POST dari handlers pada auth.ts. Session, CSRF, signin, dan signout memakai protokol Auth.js; CSRF tidak dinonaktifkan.

Login UI memanggil signIn credentials. AdminLayoutClient memasang SessionProvider; AdminTopbar memakai useSession dan signOut menuju /login. Mock auth hanya aktif ketika NODE_ENV development dan NEXT_PUBLIC_MOCK_AUTH true, memakai cookie/helper di `src/lib/mock-auth.ts`; mock bukan akun database.

## Guard dan role

`src/lib/auth-utils.ts` mengikat createAuthorizationGuards ke auth dan lookup User berdasarkan id. Guard memerlukan akun aktif, role ADMIN/SUPER_ADMIN, dan sessionVersion yang sama dengan database. requireSuperAdmin menambah syarat SUPER_ADMIN; mock tidak lolos guard khusus tersebut.

| Enum internal | Label UI | Akses yang diimplementasikan |
|---|---|---|
| SUPER_ADMIN | Admin PSI Surabaya | Pengelolaan akun, review, seluruh konten, mutation langsung |
| ADMIN | Admin | Pengelolaan konten milik sendiri melalui pengajuan, daftar pengajuan sendiri |

Nama akun tetap User.name, bukan label role. Guard memvalidasi ulang role dari database. `verifyContentActor()` memeriksa akun lagi di dalam transaksi mutation konten.

Repository memuat `src/middleware.ts` (matcher admin/login) dan `proxy.ts` di root (matcher mengecualikan api dan aset tertentu). Keduanya menggunakan authConfig untuk pemeriksaan JWT; file tersebut tidak menggantikan guard database. File middleware/proxy yang efektif bergantung discovery Next.js pada struktur deployment; keberadaan kedua source tidak membuktikan keduanya berjalan bersamaan. Dashboard layout memakai AuthGuard; halaman seperti Overview juga menjaga query secara langsung.

saveAdmin dijaga requireSuperAdmin dan validasi ulang actor dalam transaksi Serializable. Perubahan role, status aktif, atau password menaikkan sessionVersion. Akun sendiri yang terkena perubahan sensitif menghasilkan sessionRevoked dan UI memanggil signOut. Perubahan nama/email biasa tidak menaikkan versi sesi. Admin aktif terakhir dengan role SUPER_ADMIN tidak dapat dinonaktifkan/diturunkan role-nya. UI meminta konfirmasi perubahan sensitif akun existing.

## Ownership

ownedContentWhere melakukan filter pemilik di database melalui ContentChange.authorId dan menghasilkan scope id untuk query listing. Untuk News/Event legacy, authorId canonical menjadi fallback hanya bila belum ada ContentChange pada pasangan kind/targetId. Metadata central selalu diutamakan. Legacy modul lain tanpa mapping ownership hanya dapat dikelola Admin PSI Surabaya. canManageContent memakai scope yang sama; submitContent memeriksa owner lagi di transaksi.

## Pengajuan dan canonical

ContentChange menyimpan satu record per kind/targetId, bukan log append-only. Modul yang didukung: news, event, member, managementPeriod, managementPosition, university, publication, gallery. Operation adalah CREATE/UPDATE/DELETE. before adalah snapshot canonical; payload adalah usulan; baseHash mendeteksi perubahan canonical.

- ADMIN CREATE: id target dibuat, proposal PENDING_REVIEW disimpan; canonical belum dibuat.
- ADMIN UPDATE/DELETE: canonical tetap tersedia sampai persetujuan. Toggle/unpublish adalah pengajuan perubahan yang ikut direview.
- SUPER_ADMIN melalui submitContent: perubahan langsung diterapkan dan metadata ditandai APPROVED; pemilik existing tetap dipertahankan.
- Review approve: hanya PENDING_REVIEW, cocokkan versi dan hash canonical, terapkan perubahan, tandai APPROVED, isi reviewer/waktu, kosongkan payload/before.
- Review revision: alasan wajib, maksimal 5000 karakter; status menjadi REVISION_REQUIRED, canonical tetap utuh.
- Resubmit: pemilik atau Admin PSI Surabaya dapat merevisi PENDING_REVIEW/REVISION_REQUIRED; versi dan baseHash harus cocok, status kembali PENDING_REVIEW, metadata review direset.

CREATE News/Event dari ADMIN menjadi proposal status PUBLISHED. CREATE Publication dari ADMIN tanpa tanggal memperoleh publishedAt saat pengajuan. Persetujuan tidak menggantikan aturan visibilitas publik: News/Event tetap membutuhkan PUBLISHED; Publication memerlukan tanggal terbit yang sudah jatuh tempo.

DELETE periode juga menghapus posisi karena FK cascade. University yang masih memiliki anggota ditolak oleh applyContent. Pengajuan delete harus dikonfirmasi di UI sebelum disetujui. isContentApprovalReady memeriksa akses ContentChange dan keberadaan News.pendingRevision legacy yang belum direkonsiliasi; jalur mutation diblokir bila approval belum siap.

## Optimistic concurrency control

UPDATE/DELETE, toggle, dan aktivasi periode wajib membawa ContentVersion: fingerprint canonical dan nomor versi ContentChange (atau null bila belum ada). Halaman membaca metadata proposal sebelum canonical; draft mempertahankan token awal. Pemeriksaan dan mutation berada dalam transaksi Serializable melalui mutateWithMedia; proposal existing di-update dengan syarat contentVersion dan dinaikkan versinya.

Fingerprint canonical memakai News.contentVersion; model dengan updatedAt memakai timestamp tersebut; ManagementPosition memakai field scalar yang dapat diedit; ManagementPeriod memakai period/isActive dan snapshot scalar posisi. Snapshot posisi lengkap tetap dibutuhkan walaupun tabel tampilan dipaginasi. Perbedaan scope posisi dapat menghasilkan penolakan konservatif.

decideContent/reviseContent memeriksa versi pengajuan. Hash snapshot canonical juga dibandingkan dengan baseHash agar persetujuan/pengajuan ulang tidak menerapkan usulan pada canonical yang berubah. Konflik menolak mutation dan ditampilkan sebagai error. Transaksi bersamaan yang gagal serialisasi menghasilkan pesan muat ulang, tanpa retry mutation otomatis pada helper ini.

Token berfokus pada target/proposal; bukan versi global seluruh relasi. Nilai updatedAt bergantung writer yang memperbaruinya. Source tidak menjamin perubahan melalui writer eksternal ikut mengikuti semua aturan aplikasi.
