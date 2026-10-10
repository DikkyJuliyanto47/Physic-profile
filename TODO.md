# TODO — PSI Surabaya

## AUDIT SISTEM PSI SURABAYA

### A. Ringkasan Audit

Tanggal audit: **10 Oktober 2026 (Asia/Jakarta)**. Metode: pemeriksaan statis source, penelusuran UI → server action/route handler → Prisma/schema/migration → reader publik, dan pembacaan dokumentasi/source dependensi lokal. `TODO.md` belum tersedia saat discovery; laporan ini membuat file baru. Catatan lama di `AUDIT.md`, `README.md`, dan file lain tidak diubah.

**Kesimpulan:** sistem belum dapat dinyatakan siap handover tanpa penyelesaian masalah utama dan verifikasi staging. Ditemukan **23 temuan Confirmed** dan **7 Need Verification**. Confirmed berarti perilaku atau celah implementasi didukung source; **bukan klaim pengujian runtime telah dilakukan**.

| Severity | Confirmed | Need Verification | Total |
| --- | ---: | ---: | ---: |
| P0 | 0 | 0 | 0 |
| P1 | 3 | 4 | 7 |
| P2 | 13 | 3 | 16 |
| P3 | 7 | 0 | 7 |
| **Total** | **23** | **7** | **30** |

Prioritas pertama: pencabutan session admin (AUDIT-001), pemulihan password semu (AUDIT-002), alur publikasi yang tidak konsisten (AUDIT-003), kontrak timezone agenda (AUDIT-004), serta verifikasi persistensi upload (AUDIT-025). Keaktifan secret historis (AUDIT-030) harus diverifikasi secara privat sebelum menyimpulkan dampaknya. Tidak ada P0 yang dapat dibuktikan dalam batas audit ini.

#### Arsitektur dan stack yang ditemukan

- Next.js **16.2.12**, App Router di `src/app`, React/React DOM **19.2.4**, TypeScript dengan `strict: true`, Tailwind CSS 4, npm dengan `package-lock.json`. Node.js adalah runtime yang dibutuhkan oleh filesystem upload/driver PostgreSQL; versi runtime deployment tidak tersedia.
- Prisma **7.9.1** pada lockfile/konfigurasi proyek, PostgreSQL, `@prisma/adapter-pg` dan `pg`; generated client di `src/generated/prisma`. Singleton berada di `src/lib/prisma.ts`. `docker-compose.yml` hanya menyediakan PostgreSQL 16 lokal.
- NextAuth **5.0.0-beta.32**, credentials provider, bcryptjs, session JWT. Login melalui `/api/auth/[...nextauth]`; tidak ditemukan registrasi publik, CRUD akun pengelola, atau modul pengaturan admin. `User` terpisah dari `MemberProfile`.
- Struktur public route: `/`, `/about`, `/news`, `/news/[slug]`, `/events`, `/events/[slug]`, `/members`, `/managements`, `/universities`, `/universities/[slug]`, `/research`, `/gallery`, `/contact`.
- Admin menyediakan dashboard dan CRUD berita, agenda, anggota, periode/posisi kepengurusan, kampus, publikasi, dan galeri. Forms/action controls adalah Client Components; daftar/detail dan query adalah Server Components. State menggunakan React useState/useTransition; filter daftar admin umumnya melalui searchParams/form GET. Tidak ditemukan store global atau REST CRUD terpisah.
- Mutasi di `src/actions/*.ts` langsung memakai Prisma; `src/server/services/index.ts` kosong. API aplikasi yang tersedia adalah handler auth dan `POST /api/upload`; read publik memakai helper server dan read admin umumnya query Prisma langsung.
- `cacheComponents: true` aktif. `src/lib/data.ts` dan reader publikasi memakai `use cache`, `cacheLife("hours")`, `cacheTag`. Mutasi memakai `updateTag`/`revalidatePath`. Halaman home dan komponen riset juga memiliki query langsung. Guide lokal Next sudah dibaca; tidak menganggap ketiadaan `force-dynamic` sebagai defect karena konvensi Cache Components berbeda.
- `University → MemberProfile` memakai SetNull; `ManagementPeriod → ManagementPosition` memakai Cascade; posisi ke anggota memakai SetNull; berita/agenda ke author memakai foreign key Restrict pada baseline. Unique constraint tersedia untuk email user/anggota, nama/slug kampus, slug berita/agenda, dan nama periode. Baseline SQL sesuai model utama saat ini; migration berikutnya kosong. **Status migration database nyata belum diperiksa.**
- Upload terautentikasi ke filesystem `public/uploads/news`; dipakai oleh berita, agenda, foto anggota, logo kampus, galeri. MIME/extension, ukuran 1 MB, filename, dan signature PNG/JPEG/WebP diperiksa. Tidak ditemukan upload video/PDF atau layanan storage eksternal; publikasi dapat menyimpan externalUrl/fileUrl pada schema, tetapi form/action hanya mengelola externalUrl.
- Integrasi eksternal bersifat presentasi: YouTube/embed/thumbnail, Google Maps, CDN Font Awesome, font Google, dan tautan share. Tidak ditemukan SMTP/payment/analytics backend.
- Env source/config: `DATABASE_URL`, `AUTH_SECRET`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_MOCK_AUTH`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `NODE_ENV`. Isi credential aktif tidak diperiksa atau ditampilkan. Tidak ditemukan konfigurasi deployment aplikasi/CI/CD/provider di file yang didiscovery.
- Home gallery statis sengaja terpisah dari galeri CMS menurut README: `GallerySection → home/data.ts → public/assets`. Perubahan galeri admin tidak mengubah carousel tersebut; ini **bukan bug sinkronisasi** tanpa perubahan kebutuhan.

#### Ringkasan kontrol dan batas kesimpulan keamanan

Semua fungsi mutasi CRUD yang ditelusuri memanggil `requireAdmin()`; upload juga memeriksanya. Beberapa guard tidak berada tepat di baris pertama, tetapi tidak ditemukan write database sebelum guard. Protected admin layout tersedia; lokasi proxy/middleware efektif masih perlu verifikasi. Role yang diterima adalah ADMIN/SUPER_ADMIN; perbedaan dengan kebutuhan satu role dibahas AUDIT-020.

Password dibandingkan dengan bcryptjs; seed melakukan hash dengan cost 10 dan membaca password dari env. Session menyimpan id/role; tidak ditemukan penyimpanan token auth aplikasi di localStorage. Default dependensi Auth.js lokal menggunakan cookie httpOnly/sameSite=lax dan session idle maxAge 30 hari (`node_modules/@auth/core/src/lib/init.ts:71-126`, `.../utils/cookie.ts:59-89`); cookie secure/expiry/renewal aktual bergantung deployment dan belum diuji. Logout normal menggunakan signOut; mock auth hanya aktif ketika NODE_ENV development dan flag true. **Mock auth tidak dinyatakan sebagai bypass production.**

HTML detail berita/agenda melalui `sanitizeHtml` pada reader sebelum `dangerouslySetInnerHTML` (`src/lib/data.ts:84-109,184-209`). Tidak ditemukan raw SQL/eval pada jalur aplikasi yang diperiksa. Tautan eksternal tertentu belum divalidasi scheme di server; tidak diklaim sebagai confirmed XSS karena sink/framework/skenario browser belum diverifikasi. Next Server Actions menyediakan pemeriksaan Origin/Host menurut guide lokal; Auth.js memiliki CSRF check lokal untuk credentials/signout. Route upload hanya memakai guard/cookie, sehingga perilaku CSRF, batas body proxy, dan cookie HTTPS harus diverifikasi pada staging; **ketiadaan token CSRF manual saja bukan bukti vulnerability**.

Unique/FK mencegah sebagian duplicate/orphan row, tetapi tidak mengatasi seluruh invariant bisnis/concurrent update. Query include/select yang ditemukan tidak cukup untuk menyimpulkan N+1 tanpa pengukuran SQL. Error umum kebanyakan tidak membocorkan detail database ke client, namun observability dan recovery belum merata. Audit dependency hanya menilai manifest/lockfile dan pemakaian; tidak ada pemindaian advisory/CVE atau klaim versi bebas vulnerability.

### B. Critical Issues — P0

Tidak ada temuan P0 yang dapat dikonfirmasi secara statis. Ini tidak menyatakan sistem aman dari semua risiko kritis.

### C. High Priority — P1

### [ ] AUDIT-001 — Session admin tetap berwenang setelah akun dinonaktifkan atau kredensial diganti

**Prioritas:** P1

**Kategori:** Security

**Status:** Confirmed

**Modul:** Authentication

**Lokasi Kode:**
- `src/auth.ts:24-51`
- `src/auth.ts:55-69`
- `src/lib/auth-utils.ts:5-10`
- `prisma/seed.ts:23-30`

**Masalah:**
Status isActive hanya diperiksa saat login. Session yang sudah diterbitkan tetap diterima tanpa membaca kondisi akun terkini.

**Penyebab Teknis:**
Callback jwt hanya menyalin id/role ketika user tersedia; requireAdmin hanya mempercayai claim session. Penggantian password melalui seed juga tidak mengganti versi session.

**Dampak:**
Pemegang cookie valid dapat tetap melakukan CRUD/upload setelah akun dinonaktifkan atau password diubah, hingga token kedaluwarsa. Ini memerlukan session valid sebelumnya; bukan bypass login tanpa kredensial.

**Bukti:**
authorize memeriksa user.isActive, tetapi jalur jwt/session/requireAdmin tidak memeriksa database kembali. Konfigurasi session hanya menetapkan strategy jwt.

**Cara Verifikasi:**
Pada lingkungan uji terisolasi: login, nonaktifkan akun atau ganti hash password melalui prosedur pengelolaan akun, lalu coba mutasi dan upload dengan session lama. Pastikan session baru tetap mengikuti status akun.

**Rekomendasi Perbaikan:**
Periksa akun aktif dan role terkini di guard server; tetapkan cara pencabutan session ketika password berubah, misalnya versi token. Tetapkan maxAge sesuai kebijakan pengelola.

**Risiko Perbaikan:**
Tambahan query auth serta penyesuaian mock-auth; semua server action dan upload menggunakan guard yang sama.

**Confidence:** High

---

### [ ] AUDIT-002 — Forgot/reset password menampilkan sukses tanpa memulihkan akun

**Prioritas:** P1

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Pemulihan password

**Lokasi Kode:**
- `src/app/(admin)/forgot-password/page.tsx:12-20`
- `src/app/(admin)/forgot-password/page.tsx:94-103`
- `src/app/(admin)/reset-password/page.tsx:17-37`
- `src/app/api/auth/[...nextauth]/route.ts:1-3`

**Masalah:**
UI menyatakan email reset telah dikirim dan perubahan password berhasil, padahal tidak ada proses tersebut.

**Penyebab Teknis:**
Kedua handler hanya menunggu setTimeout 700 ms lalu mengganti state. Tidak ada pengiriman email, token reset, validasi token, atau update passwordHash.

**Dampak:**
Admin yang kehilangan password tidak bisa pulih melalui UI; pesan sukses mengarahkan pengelola pada hasil yang tidak terjadi. Bukan kerentanan pengambilalihan akun melalui reset, karena password tidak berubah.

**Bukti:**
handleSubmit pada kedua halaman tidak memanggil action/API. Endpoint auth hanya mengekspor handler NextAuth.

**Cara Verifikasi:**
Di lingkungan uji, ajukan reset dan submit password baru; periksa tidak ada request pemulihan dan password login tetap lama.

**Rekomendasi Perbaikan:**
Untuk handover minimal, hentikan klaim sukses dan arahkan ke prosedur pemulihan manual yang nyata. Implementasi reset lengkap hanya setelah ruang lingkup disepakati.

**Risiko Perbaikan:**
Tautan lupa password di login dan SOP pengelolaan akun harus konsisten.

**Confidence:** High

---

### [ ] AUDIT-003 — Halaman riset mengabaikan reader publikasi terfilter dan field admin tidak lengkap

**Prioritas:** P1

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Riset & Publikasi

**Lokasi Kode:**
- `src/app/(public)/research/page.tsx:7-11`
- `src/app/(public)/research/page.tsx:30-30`
- `src/components/features/research/data.ts:20-39`
- `src/components/features/research/ResearchPublicationSection.tsx:17-32`
- `src/components/admin/PublicationForm.tsx:43-51`
- `src/components/admin/PublicationForm.tsx:89-204`
- `src/actions/publication.ts:59-71`

**Masalah:**
Data terfilter yang diambil halaman tidak digunakan. Komponen mengambil seluruh publikasi lagi tanpa filter publishedAt, menghilangkan deskripsi dan fallback fileUrl. Form menyimpan publishedAt tetapi tidak menyediakan input untuk mengaturnya.

**Penyebab Teknis:**
Type assertion as unknown memaksakan props publications pada komponen async yang tidak menerima props. Query kedua tanpa where. Publikasi baru dari form memiliki publishedAt kosong dan action mengubahnya menjadi null.

**Dampak:**
Publikasi belum bertanggal/bertanggal masa depan ikut tampil, berbeda dari kebijakan reader yang tersedia; informasi deskripsi dan tautan file dapat hilang. Admin tidak dapat mengelola tanggal terbit melalui UI. Jika koleksi memang sengaja memuat semuanya, kebijakan perlu ditegaskan sebelum menambah filter.

**Bukti:**
Reader memakai publishedAt not:null dan lte:new Date(), sedangkan ResearchPublicationSection memakai findMany tanpa where dan href hanya externalUrl; meta hanya tahun.

**Cara Verifikasi:**
Siapkan publikasi bertanggal lampau, null, dan masa depan di fixture uji. Bandingkan hasil reader dan UI; periksa deskripsi/fileUrl. Coba atur tanggal melalui form.

**Rekomendasi Perbaikan:**
Gunakan satu reader dan props bertipe eksplisit; selaraskan aturan publikasi dengan pengelola serta tampilkan field tanggal bila tetap menjadi penentu visibilitas. Pertahankan fallback fileUrl yang sudah ada.

**Risiko Perbaikan:**
Mengubah filter dapat menyembunyikan publikasi null yang sekarang tampil; inventarisasi data sebelum perubahan.

**Confidence:** High

---

### D. Medium Priority — P2

### [ ] AUDIT-004 — Tanggal/jam agenda bergantung timezone server dan browser

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Agenda

**Lokasi Kode:**
- `src/components/admin/EventForm.tsx:67-72`
- `src/components/admin/EventForm.tsx:93-102`
- `src/actions/event.ts:60-65`
- `src/actions/event.ts:115-120`
- `src/lib/data.ts:20-33`
- `src/lib/data.ts:175-176`
- `src/app/(public)/events/[slug]/page.tsx:17-31`

**Masalah:**
datetime-local dikirim tanpa offset. Server menafsirkannya memakai timezone proses, sementara reader memformat waktu tanpa timeZone dan menambahkan label WIB.

**Penyebab Teknis:**
new Date(data.startDate) menerima string lokal tanpa offset; getHours pada form mengikuti browser; Intl.DateTimeFormat tidak menetapkan Asia/Jakarta.

**Dampak:**
Pada server UTC dan browser Jakarta, waktu tersimpan/ditampilkan dapat berbeda 7 jam dan bergeser tanggal. Implementasi tidak menjamin WIB; kejadian pada deployment saat ini belum diuji.

**Bukti:**
Form menghasilkan YYYY-MM-DDTHH:mm. Action tidak menambahkan offset. Reader mencetak hasil formatEventTime dengan suffix WIB.

**Cara Verifikasi:**
Pada staging terisolasi dengan server UTC dan browser Asia/Jakarta, simpan 10 Oktober 2026 09:00, buka ulang edit dan detail; bandingkan instant database, input, dan label WIB.

**Rekomendasi Perbaikan:**
Tentukan kontrak timezone Asia/Jakarta, kirim instant dengan offset/ISO, dan format dengan timeZone eksplisit. Audit data lama sebelum konversi.

**Risiko Perbaikan:**
Koreksi massal tanpa mengetahui timezone input lama dapat menggeser data yang sebelumnya benar; form publikasi memakai pola lokal serupa.

**Confidence:** High

---

### [ ] AUDIT-005 — Submit agenda berhasil tetapi form tetap di mode create tanpa notifikasi

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Dashboard Agenda

**Lokasi Kode:**
- `src/components/admin/EventForm.tsx:195-231`
- `src/actions/event.ts:55-58`
- `src/app/(admin)/admin/events/new/page.tsx:19-21`

**Masalah:**
Sesudah create/update sukses, handler hanya refresh. Banner sukses bergantung query success=true yang tidak dipasang handler.

**Penyebab Teknis:**
Tidak ada perpindahan route, perubahan mode, reset form, atau state sukses. State form tetap memegang judul yang sama.

**Dampak:**
Admin tidak memperoleh konfirmasi dan bisa mengirim ulang; create ulang ditolak karena slug sama walaupun penyimpanan pertama berhasil.

**Bukti:**
Cabang result.success hanya router.refresh(); isSuccess berasal dari useSearchParams, bukan hasil submit.

**Cara Verifikasi:**
Buat agenda valid di lingkungan uji; amati URL/form/pesan, lalu tekan simpan kembali. Periksa hanya satu record dan pesan duplicate.

**Rekomendasi Perbaikan:**
Sesudah sukses pindah ke daftar/detail atau simpan state sukses dan hentikan mode create; ikuti pola modul lain.

**Risiko Perbaikan:**
Alur navigasi dan preservasi nilai form edit harus tetap nyaman.

**Confidence:** High

---

### [ ] AUDIT-006 — Pencarian berita mengubah URL tanpa memfilter data

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Berita publik

**Lokasi Kode:**
- `src/components/features/news/NewsSearch.tsx:12-26`
- `src/app/(public)/news/page.tsx:14-29`
- `src/lib/data.ts:48-71`

**Masalah:**
Input pencarian mengirim q tetapi halaman hanya membaca kategori.

**Penyebab Teknis:**
Tipe searchParams tidak memuat q, destructuring mengabaikannya, dan reader tidak menerima kata kunci.

**Dampak:**
Hasil sama untuk semua kata pencarian; fungsi utama eksplorasi berita tidak bekerja.

**Bukti:**
NewsSearch memasang params.set('q', query); getPublishedNews hanya memfilter status dan kategori.

**Cara Verifikasi:**
Cari judul unik dan kata yang tidak ada; bandingkan record serta featured news pada hasil.

**Rekomendasi Perbaikan:**
Baca/normalisasi q dan terapkan filter judul/konten yang disepakati; pertahankan kombinasi kategori dan kata kunci.

**Risiko Perbaikan:**
Cache key, featured item, empty state, dan tautan kategori harus mempertahankan perilaku filter.

**Confidence:** High

---

### [ ] AUDIT-007 — Parameter kategori tidak valid diteruskan langsung ke enum Prisma

**Prioritas:** P2

**Kategori:** Reliability

**Status:** Confirmed

**Modul:** Berita publik

**Lokasi Kode:**
- `src/app/(public)/news/page.tsx:23-24`
- `src/lib/data.ts:55-59`
- `prisma/schema.prisma:25-32`

**Masalah:**
Nilai kategori dari URL tidak divalidasi sebelum menjadi filter enum.

**Penyebab Teknis:**
Cast kategori as never hanya membungkam TypeScript dan tidak mengubah input runtime; query tidak memiliki fallback kesalahan lokal.

**Dampak:**
URL salah atau parameter berulang dapat membuat query ditolak dan halaman gagal, alih-alih mengabaikan filter atau menampilkan pesan validasi.

**Bukti:**
getPublishedNews menyebarkan category:kategori pada semua nilai truthy; enum database hanya mengizinkan enam kategori.

**Cara Verifikasi:**
Di lingkungan uji, buka /news?kategori=INVALID dan parameter kategori berulang; periksa penanganan error dan status respons.

**Rekomendasi Perbaikan:**
Normalisasi string/string[] dan gunakan allowlist enum sebelum query; pilih respons terkontrol untuk filter invalid.

**Risiko Perbaikan:**
Pastikan query valid dan cache tidak berubah makna; jangan mengembalikan detail error database.

**Confidence:** High

---

### [ ] AUDIT-008 — Pencarian kepengurusan menuju /management yang tidak tersedia

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Kepengurusan publik

**Lokasi Kode:**
- `src/components/features/management/ManagementSection.tsx:38-54`
- `src/app/(public)/managements/page.tsx:6-25`

**Masalah:**
Form pencarian submit ke route singular /management; repository menyediakan /managements. Halaman yang benar juga tidak membaca q atau memfilter anggota.

**Penyebab Teknis:**
action form salah dan query tidak diteruskan ke komponen.

**Dampak:**
Submit pencarian menuju 404; mengganti action saja belum membuat pencarian bekerja.

**Bukti:**
Form memiliki action='/management'; route publik aktual managements/page.tsx memanggil getActiveManagement tanpa parameter pencarian.

**Cara Verifikasi:**
Dengan periode aktif berisi posisi, submit pencarian nama; setelah perbaikan cek keyword cocok/tidak cocok dan Enter pada keyboard.

**Rekomendasi Perbaikan:**
Selaraskan action dengan /managements dan filter data/props query secara nyata.

**Risiko Perbaikan:**
Filter harus menjaga struktur periode, empty state, serta anchor navigasi.

**Confidence:** High

---

### [ ] AUDIT-009 — Kartu video menggunakan URL halaman YouTube sebagai gambar

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Galeri publik

**Lokasi Kode:**
- `src/lib/data.ts:321-329`
- `src/components/features/gallery/GalleryItemCard.tsx:18-25`
- `src/components/admin/GalleryForm.tsx:60-65`
- `src/app/(admin)/admin/gallery/page.tsx:14-21`

**Masalah:**
Untuk mediaType VIDEO, image diisi mediaUrl yang berisi halaman watch/short link, bukan thumbnail.

**Penyebab Teknis:**
Mapper tidak membedakan sumber preview foto/video; GalleryItemCard selalu merender Image.

**Dampak:**
Preview video rusak meskipun tautan menuju video benar; berpotensi berbeda dengan preview admin yang sudah memakai thumbnail.

**Bukti:**
Mapper image:item.mediaUrl berlaku untuk kedua tipe; admin list memiliki getYouTubeThumbnail yang mengembalikan img.youtube.com.

**Cara Verifikasi:**
Simpan video YouTube valid lewat admin uji, buka /gallery dan periksa request gambar serta preview admin.

**Rekomendasi Perbaikan:**
Pisahkan href media dan thumbnail; gunakan parser URL YouTube konsisten dan fallback untuk video tidak valid.

**Risiko Perbaikan:**
Jangan mengganti href menjadi URL thumbnail; tautan video harus tetap menuju video.

**Confidence:** High

---

### [ ] AUDIT-010 — Direktori kampus dirender dua kali saat data anggota tersedia

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Perguruan Tinggi publik

**Lokasi Kode:**
- `src/app/(public)/universities/page.tsx:45-46`
- `src/components/features/members/MembersSection.tsx:146-146`
- `src/components/features/universities/UniversitiesSection.tsx:5-9`

**Masalah:**
Halaman /universities merender MembersSection yang sudah menyertakan UniversitiesSection, lalu menambahkan UniversitiesSection lagi.

**Penyebab Teknis:**
Prop universityDirectory tidak dipasang; fallback komponen anggota aktif saat setidaknya satu kelompok anggota tersedia.

**Dampak:**
Kartu kampus muncul dua kali dan id perguruan-tinggi duplikat; anchor menunjuk salah satu dari dua section.

**Bukti:**
MembersSection memakai universityDirectory ?? <UniversitiesSection />; halaman menambahkan komponen identik sebagai sibling.

**Cara Verifikasi:**
Dengan minimal satu anggota dan satu kampus, buka /universities; hitung section #perguruan-tinggi dan kartu kampus. Bandingkan saat anggota kosong.

**Rekomendasi Perbaikan:**
Render direktori tepat sekali; gunakan slot universityDirectory yang sudah tersedia atau hapus sibling yang redundant setelah meninjau empty state.

**Risiko Perbaikan:**
MembersSection juga digunakan /members; jangan menghilangkan direktori pada halaman tersebut.

**Confidence:** High

---

### [ ] AUDIT-011 — Agenda lampau dilabeli mendatang dan agenda berjalan dilabeli selesai

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Agenda publik

**Lokasi Kode:**
- `src/lib/data.ts:152-168`
- `src/app/(public)/events/page.tsx:13-14`
- `src/components/features/events/FeaturedEvent.tsx:36-38`
- `src/app/(public)/events/[slug]/page.tsx:85-108`

**Masalah:**
Featured mengambil record terbaru dari semua agenda terbit tanpa batas waktu tetapi label selalu Agenda Mendatang. Detail menetapkan selesai setelah startDate lewat, tanpa mempertimbangkan endDate.

**Penyebab Teknis:**
Urutan startDate desc bukan pemilihan agenda mendatang terdekat; isPast hanya membandingkan tanggal mulai dengan sekarang.

**Dampak:**
Jika hanya ada agenda lampau, pengunjung melihat informasi mendatang yang salah. Acara beberapa hari dapat disebut selesai ketika masih berjalan.

**Bukti:**
getPublishedEvents tidak memiliki filter waktu; FeaturedEvent memakai label statis; detail tidak memakai endDate untuk status selesai.

**Cara Verifikasi:**
Siapkan acara lampau, sedang berlangsung, dan dua acara mendatang; periksa featured serta label detail.

**Rekomendasi Perbaikan:**
Pisahkan aturan featured/arsip dan gunakan endDate ?? startDate untuk status selesai; sepakati urutan kegiatan mendatang.

**Risiko Perbaikan:**
Perubahan memengaruhi urutan daftar dan empty state arsip; jangan menyembunyikan agenda historis.

**Confidence:** High

---

### [ ] AUDIT-012 — Beberapa submit tidak memulihkan state ketika request action melempar error

**Prioritas:** P2

**Kategori:** Reliability

**Status:** Confirmed

**Modul:** Form dan aksi dashboard

**Lokasi Kode:**
- `src/components/admin/NewsForm.tsx:158-181`
- `src/components/admin/MemberForm.tsx:139-159`
- `src/components/admin/PublicationForm.tsx:66-86`
- `src/components/admin/UniversityForm.tsx:130-156`
- `src/components/admin/ManagementPeriodForm.tsx:30-51`
- `src/components/admin/ManagementPositionForm.tsx:47-77`

**Masalah:**
Handler menaikkan isSubmitting lalu await action tanpa catch/finally. Error jaringan/transport tidak selalu menjadi ActionResponse dari server.

**Penyebab Teknis:**
setIsSubmitting(false) hanya dijalankan setelah promise berhasil resolve. Guard member juga dipanggil di luar try server action.

**Dampak:**
Jika promise rejected karena koneksi putus atau auth error, form dapat terus menampilkan menyimpan dan tombol tetap disabled. Kondisi runtime belum dijalankan, tetapi jalur pemulihan memang tidak ada.

**Bukti:**
Enam handler di lokasi tersebut memiliki await sebelum reset state dan tidak memiliki catch/finally; EventForm/GalleryForm sudah menangani rejection.

**Cara Verifikasi:**
Saat memakai lingkungan lokal uji, putuskan koneksi setelah submit atau simulasikan rejected action; cek nilai input, pesan error, dan kemampuan retry.

**Rekomendasi Perbaikan:**
Tambahkan try/catch/finally minimal pada handler yang belum terlindungi, dengan pesan transport terpisah dan nilai form dipertahankan.

**Risiko Perbaikan:**
Retry setelah respons hilang tidak boleh otomatis mengulang create; operasi pertama mungkin sudah committed.

**Confidence:** High

---

### [ ] AUDIT-013 — Toggle status mengabaikan hasil gagal, termasuk berita terarsip

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Berita/Agenda dashboard

**Lokasi Kode:**
- `src/app/(admin)/admin/news/NewsActions.tsx:24-29`
- `src/app/(admin)/admin/news/NewsActions.tsx:46-57`
- `src/actions/news.ts:258-265`
- `src/app/(admin)/admin/events/EventActions.tsx:25-29`

**Masalah:**
UI toggle selalu refresh tanpa memeriksa ActionResponse. Tombol berita terarsip berlabel Terbitkan walaupun backend melarang perubahan melalui toggle.

**Penyebab Teknis:**
Cabang error hasil action tidak ditampilkan dan tombol tidak dibedakan untuk ARCHIVED.

**Dampak:**
Admin menekan tombol yang tidak bekerja tanpa penjelasan; kegagalan database/session pada toggle agenda juga tidak terlihat.

**Bukti:**
toggleNewsStatus mengembalikan error untuk ARCHIVED; handleToggle membuang return value pada kedua modul.

**Cara Verifikasi:**
Coba toggle berita ARCHIVED serta simulasikan action gagal; pastikan UI memberi pesan dan status tidak berubah palsu.

**Rekomendasi Perbaikan:**
Periksa result.success/error dan sembunyikan/nonaktifkan toggle berita ARCHIVED atau arahkan ke edit.

**Risiko Perbaikan:**
Semantik status agenda berbeda dari berita; jangan menyamakan aturan arsip tanpa keputusan bisnis.

**Confidence:** High

---

### [ ] AUDIT-014 — Media yang diganti, dibatalkan, atau dihapus tidak dibersihkan

**Prioritas:** P2

**Kategori:** Reliability

**Status:** Confirmed

**Modul:** Upload/media lintas modul

**Lokasi Kode:**
- `src/app/api/upload/route.ts:86-95`
- `src/actions/news.ts:171-181`
- `src/actions/news.ts:220-225`
- `src/actions/gallery.ts:84-95`
- `src/actions/gallery.ts:120-123`
- `src/components/admin/UniversityForm.tsx:102-121`

**Masalah:**
Upload membuat file permanen sebelum form disimpan; update/delete record tidak menghapus file lama. Tidak ada endpoint/action cleanup file di source yang ditemukan.

**Penyebab Teknis:**
Lifecycle file tidak dikaitkan dengan commit record atau referensi media; semua modul memakai direktori uploads/news yang sama.

**Dampak:**
File tanpa referensi menumpuk dan gambar yang dianggap terhapus dapat tetap diakses via URL lama. Ini berlaku pada deployment yang memang melayani folder tersebut.

**Bukti:**
Route memakai UUID/writeFile; action hanya mengubah/menghapus row Prisma. Pencarian unlink/deleteFile/cleanup di source tidak menemukan penghapusan media.

**Cara Verifikasi:**
Upload lalu batalkan; ganti gambar; hapus item. Di lingkungan uji periksa keberadaan file dan akses URL lama.

**Rekomendasi Perbaikan:**
Tetapkan cleanup file terkelola sesudah referensi hilang atau pembersihan terjadwal; validasi path dan cek penggunaan lintas record sebelum menghapus.

**Risiko Perbaikan:**
URL yang dipakai beberapa record/static asset harus dilindungi dari penghapusan; jangan hapus path arbitrer dari input.

**Confidence:** High

---

### [ ] AUDIT-015 — Sitemap dan sejumlah anchor navigasi tidak sesuai route/section aktual

**Prioritas:** P2

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Navigasi publik & SEO

**Lokasi Kode:**
- `src/app/sitemap.ts:14-19`
- `src/app/sitemap.ts:34-40`
- `src/config/site.ts:14-45`
- `src/components/features/about/data.ts:1-2`
- `src/components/features/gallery/DocumentationGrid.tsx:49-79`
- `src/components/features/research/RecentPublications.tsx:138-189`
- `src/components/features/management/ManagementSection.tsx:56-60`

**Masalah:**
Sitemap memakai /agenda, /agenda/[slug], dan /research-publication, sementara route aktual /events dan /research. Navbar mengarah #profil, #periode, #research, #publication, #book, #photos, #videos yang tidak disediakan halaman terkait.

**Penyebab Teknis:**
Konfigurasi URL tidak diselaraskan setelah penamaan route/section berubah; tidak ada rewrite/redirect di next.config.ts.

**Dampak:**
Crawler menerima URL yang tidak tersedia; navigasi subbagian tidak menuju informasi yang dipilih.

**Bukti:**
ID aktual adalah tentang, foto, video, semua-publikasi, buku, dan ID periode dinamis; sitemap event memakai agenda. Daftar file route tidak menyediakan route pengganti.

**Cara Verifikasi:**
Periksa setiap URL sitemap dan seluruh submenu pada lingkungan uji; gunakan DOM getElementById untuk fragment. Jangan melakukan request ke production.

**Rekomendasi Perbaikan:**
Ganti URL dengan route/ID yang benar. Untuk menu periode/riset tanpa section sesuai, gunakan tujuan yang memang tersedia setelah konfirmasi makna konten.

**Risiko Perbaikan:**
Pertimbangkan URL lama yang mungkin telah dibagikan; jangan menghapus kompatibilitas tanpa inventarisasi.

**Confidence:** High

---

### [ ] AUDIT-016 — Sebagian input hanya diperiksa kehadirannya, bukan format dan nilai runtime

**Prioritas:** P2

**Kategori:** Reliability

**Status:** Confirmed

**Modul:** Validasi server CRUD

**Lokasi Kode:**
- `src/actions/member.ts:32-56`
- `src/actions/member.ts:87-113`
- `src/actions/event.ts:60-78`
- `src/actions/management.ts:220-231`
- `src/actions/management.ts:284-301`
- `src/actions/gallery.ts:32-47`

**Masalah:**
Email anggota hanya diperiksa nonkosong, tanggal agenda tidak diperiksa Invalid Date, urutan posisi hanya Number.isFinite meskipun schema Int, dan URL media tidak dipastikan dapat dirender.

**Penyebab Teknis:**
Tipe TypeScript dan validasi HTML tidak memvalidasi payload action runtime. Validasi tersebar dengan batas yang berbeda.

**Dampak:**
Email invalid dapat tersimpan melalui action; tanggal invalid/urutan pecahan ditolak Prisma dengan pesan umum; media invalid dapat tersimpan lalu gagal ditampilkan. Ini bukan bukti SQL injection atau XSS.

**Bukti:**
Member action menyimpan data.email.trim(); Event membandingkan date tanpa isNaN; management menerima angka pecahan; gallery hanya memeriksa mediaUrl.trim() tidak kosong.

**Cara Verifikasi:**
Pada lingkungan uji lewat harness action yang sah, kirim email invalid, tanggal invalid, urutan 1.5/di luar rentang Int, URL video non-YouTube. Periksa respons dan database tanpa mengeksploitasi layanan.

**Rekomendasi Perbaikan:**
Tambahkan validasi runtime minimal untuk format email, valid date, integer/rentang, enum, dan URL sesuai kebutuhan; tetap gunakan guard server.

**Risiko Perbaikan:**
Aturan baru harus kompatibel dengan data lama dan URL lokal upload; jangan menolak semua root-relative URL.

**Confidence:** High

---

### E. Low Priority — P3

### [ ] AUDIT-017 — Label beberapa form tidak terhubung dengan input

**Prioritas:** P3

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Accessibility form admin

**Lokasi Kode:**
- `src/components/admin/EventForm.tsx:52-64`
- `src/components/admin/EventForm.tsx:307-316`
- `src/components/admin/NewsForm.tsx:50-62`
- `src/components/admin/NewsForm.tsx:265-275`
- `src/components/admin/UniversityForm.tsx:169-179`
- `src/components/admin/ManagementPositionForm.tsx:88-100`

**Masalah:**
Label dirender sebagai sibling input tanpa htmlFor/id, atau FieldLabel tidak menerima target input.

**Penyebab Teknis:**
Asosiasi label browser tidak terbentuk; required secara visual tidak menggantikan nama aksesibel.

**Dampak:**
Klik label tidak memfokuskan input dan sebagian field tidak memperoleh accessible name yang andal.

**Bukti:**
FieldLabel hanya mengembalikan label className; input judul memakai name tanpa id yang dipasangkan. Member/Publication sudah memiliki pola htmlFor.

**Cara Verifikasi:**
Periksa accessible name dan klik label pada semua form dengan keyboard/screen reader di lingkungan uji.

**Rekomendasi Perbaikan:**
Pasangkan id/htmlFor secara konsisten pada field yang belum terhubung.

**Risiko Perbaikan:**
ID harus unik jika lebih dari satu form dirender bersamaan.

**Confidence:** High

---

### [ ] AUDIT-018 — PublicPageShell menambah main di dalam main dan mengulang h1

**Prioritas:** P3

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Semantic HTML publik

**Lokasi Kode:**
- `src/app/(public)/layout.tsx:20-20`
- `src/components/ui/PublicPageShell.tsx:29-37`
- `src/components/ui/PublicPageShell.tsx:83-85`
- `src/components/ui/Hero.tsx:60-63`
- `src/app/(public)/events/[slug]/page.tsx:88-88`
- `src/app/(public)/news/[slug]/page.tsx:75-80`

**Masalah:**
Layout publik menyediakan main, lalu shell/detail menyediakan main lain. Shell juga membuat h1 dengan judul yang sudah menjadi h1 pada Hero.

**Penyebab Teknis:**
Komponen halaman tidak mempertimbangkan landmark dan heading dari layout/wrapper.

**Dampak:**
Navigasi landmark screen reader menjadi ambigu. Dua h1 sendiri tidak otomatis membuktikan masalah ranking SEO; defect konkret adalah struktur semantik yang redundant.

**Bukti:**
Shell memiliki main untuk children dan h1 heading; Hero yang dipanggil shell juga memiliki h1. Layout membungkus semua children dengan main.

**Cara Verifikasi:**
Periksa DOM rendered halaman shell dan detail; evaluasi landmark serta urutan heading memakai screen reader.

**Rekomendasi Perbaikan:**
Pertahankan satu landmark utama, ubah wrapper internal ke div/section dan gunakan satu h1 yang mewakili halaman.

**Risiko Perbaikan:**
CSS yang menargetkan main dan logika RecentPublications.closest('main') perlu diperiksa ketika wrapper berubah.

**Confidence:** High

---

### [ ] AUDIT-019 — Tombol share hanya membagikan judul tanpa URL halaman

**Prioritas:** P3

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Berbagi halaman

**Lokasi Kode:**
- `src/components/ui/PublicPageShell.tsx:61-61`
- `src/components/ui/ShareActions.tsx:8-10`
- `src/components/ui/ShareActions.tsx:16-29`

**Masalah:**
Pemanggil tidak mengirim url; ShareActions mengubah undefined menjadi string kosong.

**Penyebab Teknis:**
Tidak ada fallback ke URL aktif dan interface shell tidak meneruskan URL.

**Dampak:**
Penerima pesan tidak mendapat tautan untuk membuka konten yang dibagikan.

**Bukti:**
WhatsApp memakai encodedTitle + encodedUrl, Twitter memakai parameter url kosong; satu pemanggil shell hanya memasang title.

**Cara Verifikasi:**
Buka anggota/riset lalu aktifkan share di lingkungan uji; inspeksi href tanpa perlu mengirim pesan.

**Rekomendasi Perbaikan:**
Sediakan URL canonical atau fallback browser setelah mount; pastikan URL terencode dan tidak menimbulkan hydration mismatch.

**Risiko Perbaikan:**
Domain metadata dan fragment/filter perlu dipilih secara konsisten.

**Confidence:** High

---

### [ ] AUDIT-020 — Dua role admin masih tersedia meskipun kebutuhan menetapkan satu role Admin

**Prioritas:** P3

**Kategori:** Maintainability

**Status:** Confirmed

**Modul:** Role pengelola

**Lokasi Kode:**
- `prisma/schema.prisma:14-17`
- `src/lib/auth-utils.ts:3-9`
- `src/auth.config.ts:31-36`
- `prisma/seed.ts:23-31`
- `src/components/layout/AdminTopbar.tsx:112-114`

**Masalah:**
Schema, guard, dan seed mempertahankan SUPER_ADMIN dan ADMIN; hak CMS keduanya sama.

**Penyebab Teknis:**
Tidak ada perbedaan permission pada action yang ditelusuri, tetapi seed memilih SUPER_ADMIN dan UI menampilkan role literal.

**Dampak:**
Tidak terbukti privilege escalation; ini ketidaksesuaian model/kebutuhan dan berpotensi membingungkan handover.

**Bukti:**
ALLOWED_ROLES berisi dua role dan seluruh mutasi menggunakan guard yang sama; seed role SUPER_ADMIN.

**Cara Verifikasi:**
Inventarisasi role akun pada lingkungan uji atau melalui pengelola, bandingkan hak kedua role, dan pastikan kebutuhan satu role.

**Rekomendasi Perbaikan:**
Putuskan apakah SUPER_ADMIN menjadi alias kompatibilitas atau konsolidasi terencana. Tidak perlu migrasi otomatis dalam audit.

**Risiko Perbaikan:**
Menghapus enum memerlukan pemetaan akun lama dan pencabutan JWT yang masih memuat role lama.

**Confidence:** High

---

### [ ] AUDIT-021 — Opsi Ingat saya tidak mengubah lifecycle session

**Prioritas:** P3

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Login

**Lokasi Kode:**
- `src/app/(admin)/login/page.tsx:17-17`
- `src/app/(admin)/login/page.tsx:34-38`
- `src/app/(admin)/login/page.tsx:213-223`
- `src/auth.ts:15-16`

**Masalah:**
rememberMe hanya state checkbox dan tidak memengaruhi signIn atau konfigurasi session.

**Penyebab Teknis:**
Tidak ada penggunaan rememberMe selain checked/onChange pada UI.

**Dampak:**
Pengguna mendapat ekspektasi persistensi session yang berbeda padahal kedua pilihan identik.

**Bukti:**
Payload signIn hanya email/password/redirect; maxAge tidak dikonfigurasi dari pilihan tersebut.

**Cara Verifikasi:**
Bandingkan cookie/masa berlaku login dengan checkbox aktif dan nonaktif di lingkungan uji.

**Rekomendasi Perbaikan:**
Hapus/ubah keterangan kontrol yang belum berfungsi atau definisikan kebijakan persistensi yang sungguh diterapkan.

**Risiko Perbaikan:**
Perubahan kebijakan memengaruhi keamanan workstation bersama dan ekspektasi logout; koordinasikan dengan AUDIT-001.

**Confidence:** High

---

### [ ] AUDIT-022 — Mayoritas action membuang error penyimpanan tanpa log server

**Prioritas:** P3

**Kategori:** Maintainability

**Status:** Confirmed

**Modul:** Observability mutasi

**Lokasi Kode:**
- `src/actions/member.ts:68-72`
- `src/actions/gallery.ts:54-58`
- `src/actions/publication.ts:78-82`
- `src/actions/university.ts:132-133`
- `src/actions/management.ts:313-315`
- `src/actions/news.ts:119-130`

**Masalah:**
Kegagalan database, constraint, auth, atau invalidasi umumnya berakhir pesan generik tanpa pencatatan penyebab server.

**Penyebab Teknis:**
catch tanpa variabel/log; event action justru sudah mencatat error server sehingga pola tidak konsisten.

**Dampak:**
Sulit membedakan DB unavailable, record hilang, payload invalid, atau cache gagal saat handover. Pesan generik ke client sendiri tepat untuk menghindari kebocoran detail.

**Bukti:**
Action member/gallery/publication/university/management memiliki catch yang hanya return error; news menangani P2002 tetapi sisanya tidak dicatat.

**Cara Verifikasi:**
Di lingkungan uji, simulasikan kegagalan database pada mutasi dan periksa apakah log memiliki operasi, kode error, dan ID korelasi.

**Rekomendasi Perbaikan:**
Tambahkan pencatatan server terstruktur dan aman, tetap gunakan respons publik generik/terkontrol.

**Risiko Perbaikan:**
Jangan mencatat password, cookie, token, connection string, atau seluruh payload pribadi.

**Confidence:** High

---

### [ ] AUDIT-023 — Kontak telepon dan tautan sosial masih placeholder

**Prioritas:** P3

**Kategori:** Bug

**Status:** Confirmed

**Modul:** Kontak & footer

**Lokasi Kode:**
- `src/components/features/contact/data.ts:20-25`
- `src/components/features/contact/data.ts:41-45`
- `src/components/features/contact/ConnectSection.tsx:17-20`
- `src/config/site.ts:64-69`
- `src/components/layout/PublicFooter.tsx:68-80`

**Masalah:**
Telepon berisi +62 8XX-XXXX-XXXX, alamat masih pernyataan belum tersedia, dan seluruh tautan sosial menuju /#.

**Penyebab Teknis:**
Data statis belum diganti kontak yang dikonfirmasi; sanitasi telepon sengaja tidak menghasilkan tel untuk placeholder.

**Dampak:**
Pengunjung tidak dapat memakai kanal telepon/sosial yang terlihat tersedia. Keabsahan alamat email/map belum diperiksa, bukan dinyatakan salah.

**Bukti:**
Semua socialLinks.href bernilai /#; regex phoneNumber menolak placeholder.

**Cara Verifikasi:**
Pengelola memverifikasi kontak yang benar; inspeksi href footer dan ketersediaan tel pada halaman kontak.

**Rekomendasi Perbaikan:**
Ganti dengan data terkonfirmasi atau tampilkan status belum tersedia secara eksplisit; jangan menebak akun resmi.

**Risiko Perbaikan:**
Perubahan menyentuh informasi organisasi, perlu sumber dari pengelola.

**Confidence:** High

---

### F. Potential Issues — Need Verification

Severity pada section ini merupakan prioritas verifikasi berdasarkan dampak **jika kondisi terpenuhi**, bukan severity vulnerability yang sudah terbukti. Seluruh skenario berikut belum dijalankan.

### [ ] AUDIT-024 — Pembatasan percobaan login belum terlihat di aplikasi

**Prioritas:** P1

**Kategori:** Security

**Status:** Need Verification

**Modul:** Login/API auth

**Lokasi Kode:**
- `src/auth.ts:24-51`
- `src/app/api/auth/[...nextauth]/route.ts:1-3`
- `next.config.ts:3-14`

**Masalah:**
Provider melakukan query dan bcrypt untuk setiap percobaan tanpa limiter aplikasi yang ditemukan. Rate limiting WAF/reverse proxy belum dapat diketahui.

**Penyebab Teknis:**
authorize tidak membatasi frekuensi per akun/IP; repo tidak memuat konfigurasi gateway produksi.

**Dampak:**
Jika endpoint internet tidak dilindungi limiter lain, penebakan password dan konsumsi resource auth lebih mudah. Belum ada bukti serangan atau ketiadaan limiter infrastruktur.

**Bukti:**
Jalur authorize langsung memanggil findUnique dan compare; handler auth meneruskan GET/POST ke NextAuth.

**Cara Verifikasi:**
Tinjau konfigurasi deployment/WAF bersama pengelola. Setelah diizinkan terpisah, uji batas request pada staging dengan akun dummy; jangan mencoba brute force production.

**Rekomendasi Perbaikan:**
Pastikan limiter terukur pada auth endpoint (akun/IP) dan monitoring; tambahkan di aplikasi hanya bila perlindungan eksternal tidak memadai.

**Risiko Perbaikan:**
Lockout yang agresif dapat memblokir satu-satunya admin; IP di belakang proxy harus ditentukan dengan benar.

**Confidence:** Medium

---

### [ ] AUDIT-025 — Penyimpanan upload lokal belum memiliki jaminan persistensi dan serving produksi

**Prioritas:** P1

**Kategori:** Reliability

**Status:** Need Verification

**Modul:** Deployment/media

**Lokasi Kode:**
- `src/app/api/upload/route.ts:86-95`
- `README.md:237-246`
- `docker-compose.yml:1-16`

**Masalah:**
File ditulis ke public di filesystem instance; konfigurasi production/persistent volume aplikasi tidak tersedia.

**Penyebab Teknis:**
Repo hanya menyediakan service PostgreSQL lokal dan instruksi next build/start. Tidak ada kontrak storage bersama atau backup upload.

**Dampak:**
Pada instance ephemeral, read-only, multi-instance, atau cara serving aset tertentu, upload bisa gagal, URL baru bisa 404, atau media hilang setelah redeploy. Ini bersyarat pada hosting, bukan pasti terjadi.

**Bukti:**
writeFile menggunakan process.cwd()/public/uploads/news; tidak ada integrasi object storage di route.

**Cara Verifikasi:**
Pengelola meninjau hosting/volume/backup. Di staging uji upload sesudah startup, restart/redeploy, dan baca lintas instance tanpa menyentuh production.

**Rekomendasi Perbaikan:**
Untuk satu instance pastikan folder writable, durable, dan disajikan setelah upload; gunakan storage bersama bila hosting memerlukannya. Tetapkan backup media.

**Risiko Perbaikan:**
Perpindahan storage memerlukan migrasi URL/file dan pemeliharaan tautan lama.

**Confidence:** Medium

---

### [ ] AUDIT-026 — Transaksi belum menjamin hanya satu periode aktif pada operasi konkuren

**Prioritas:** P2

**Kategori:** Reliability

**Status:** Need Verification

**Modul:** Kepengurusan & integritas kampus

**Lokasi Kode:**
- `src/actions/management.ts:47-61`
- `src/actions/management.ts:98-113`
- `src/actions/management.ts:161-171`
- `prisma/schema.prisma:125-132`
- `src/actions/university.ts:144-160`
- `prisma/schema.prisma:98-99`

**Masalah:**
Transaksi periode menonaktifkan row aktif lalu mengaktifkan/membuat target; tidak ada constraint hanya satu aktif. Penghapusan kampus juga memeriksa jumlah anggota sebelum delete terpisah.

**Penyebab Teknis:**
Tidak ada partial unique index/locking/isolation eksplisit. Foreign key kampus memakai SetNull, sehingga delete dapat memutus relasi anggota yang muncul sesudah pre-check.

**Dampak:**
Dua create aktif yang overlap saat belum ada periode aktif dapat menghasilkan lebih dari satu aktif; delete kampus bersamaan create anggota dapat melewati aturan bisnis larangan hapus kampus beranggota. Interleaving belum diuji.

**Bukti:**
Schema hanya unique pada period, bukan isActive. University count dan delete bukan satu operasi atomik. Public memakai findFirst periode aktif.

**Cara Verifikasi:**
Pada DB uji: gunakan dua koneksi tersinkron untuk membuat periode aktif saat tidak ada aktif; uji delete kampus bersamaan penambahan anggota. Periksa deadlock/retry dan hasil akhir.

**Rekomendasi Perbaikan:**
Jamin invariant di DB atau gunakan strategi transaksi/lock dengan retry; untuk kampus selaraskan onDelete dengan aturan bisnis sebelum perubahan.

**Risiko Perbaikan:**
Constraint baru harus membersihkan duplikasi aktif terlebih dahulu; Restrict mengubah perilaku delete dan pesan error.

**Confidence:** Medium

---

### [ ] AUDIT-027 — Pembacaan data admin mengandalkan layout/middleware, tanpa guard di reader/page

**Prioritas:** P1

**Kategori:** Security

**Status:** Need Verification

**Modul:** Pembacaan admin

**Lokasi Kode:**
- `src/app/(admin)/admin/layout.tsx:6-22`
- `src/app/(admin)/admin/members/page.tsx:12-48`
- `src/app/(admin)/admin/news/[id]/edit/page.tsx:15-28`
- `src/middleware.ts:6-9`
- `src/lib/auth-utils.ts:5-10`

**Masalah:**
Page melakukan query privat tanpa requireAdmin lokal; layout melakukan redirect terpisah. Mutasi dan upload sudah memiliki guard. Belum terbukti data privat bocor.

**Penyebab Teknis:**
Proteksi pembacaan bergantung pada konvensi routing, middleware yang efektif, dan perilaku rendering/RSC framework; layout bukan batas data tersendiri.

**Dampak:**
Jika jalur rendering tidak melewati guard yang diharapkan, data draft/email privat berpotensi terbaca. Penggunaan ID antar-admin sendiri bukan IDOR karena model pengelola tidak membatasi kepemilikan resource.

**Bukti:**
Page member memilih email, page edit memilih content/status; requireAdmin hanya ada di layout untuk read. Semua action mutasi yang diperiksa memanggil guard.

**Cara Verifikasi:**
Pada staging dengan mock off, periksa anonymous/expired session pada full navigation, prefetch, dan respons RSC route admin; pastikan body tidak berisi data privat. Jangan mengirim probe ke production.

**Rekomendasi Perbaikan:**
Pertimbangkan guard di fungsi pembaca privat yang mengembalikan data agar boundary otorisasi eksplisit; pastikan caching auth tidak dibagi antar-user.

**Risiko Perbaikan:**
Tambahan pemeriksaan auth dapat mengubah streaming/loading dan biaya query; tidak perlu mengubah public reader.

**Confidence:** Medium

---

### [ ] AUDIT-028 — State posisi mungkin tidak mengikuti pergantian positionId

**Prioritas:** P2

**Kategori:** Bug

**Status:** Need Verification

**Modul:** Form posisi kepengurusan

**Lokasi Kode:**
- `src/app/(admin)/admin/managements/[id]/edit/page.tsx:50-52`
- `src/app/(admin)/admin/managements/[id]/edit/page.tsx:109-129`
- `src/components/admin/ManagementPositionForm.tsx:40-45`
- `src/components/admin/ManagementPositionForm.tsx:63-66`

**Masalah:**
Form memakai useState dari initialData tanpa key/reset saat berganti posisi atau kembali ke tambah. Apakah state lama dipertahankan bergantung pada lifecycle navigasi aktual.

**Penyebab Teknis:**
Mode/id diteruskan sebagai props pada komponen yang sama; initializer useState tidak mengikuti perubahan props apabila instance dipertahankan.

**Dampak:**
Jika instance tidak remount, form dapat menampilkan nilai posisi A sementara submit memakai id posisi B, atau create memakai data edit sebelumnya.

**Bukti:**
Pemanggil tidak memasang key; form tidak memiliki effect reset pada perubahan initialData.

**Cara Verifikasi:**
Di staging klik Edit posisi A, ubah field tanpa simpan, klik Edit B, lalu Batal Edit. Periksa nilai dan target record sebelum submit.

**Rekomendasi Perbaikan:**
Jika terkonfirmasi, key berdasarkan mode/positionId atau reset state eksplisit saat target berubah.

**Risiko Perbaikan:**
Reset jangan menghapus input pada refresh biasa tanpa perubahan target; uji cancel/create/edit.

**Confidence:** Medium

---

### [ ] AUDIT-029 — Konfigurasi proxy root dan middleware src perlu dipastikan jalur efektifnya

**Prioritas:** P2

**Kategori:** Reliability

**Status:** Need Verification

**Modul:** Next.js routing/cache & kesiapan handover

**Lokasi Kode:**
- `proxy.ts:1-8`
- `src/middleware.ts:1-10`
- `next.config.ts:3-4`
- `src/app/(public)/page.tsx:13-42`
- `src/app/(public)/loading.tsx:1-26`
- `src/app/(admin)/admin/layout.tsx:20-22`
- `build-log.txt:1-12`

**Masalah:**
Repo memuat proxy di root dan middleware di src dengan matcher berbeda. Guide lokal meminta proxy setingkat app. Konfigurasi Cache Components juga memerlukan boundary data dinamis yang valid; keberhasilan build terkini belum diketahui.

**Penyebab Teknis:**
app berada di src/app. Source Next terpasang mencari convention files pada parent app; root proxy tidak otomatis dapat dianggap aktif. Loading/Suspense tersedia sehingga query uncached saja bukan bukti build gagal.

**Dampak:**
Risiko perubahan matcher tidak efektif dan setup handover tidak sesuai dokumentasi. Tidak ada bukti konflik dua file pada layout folder ini; log lama mengacu file management-section.tsx yang sudah tidak ada.

**Bukti:**
Guide node_modules/next/dist/docs/01-app/01-getting-started/16-proxy.md menyatakan proxy setingkat app/pages. node_modules/next/dist/build/index.js:613-635 menentukan rootDir dari appDir; src middleware masih konvensi deprecated. Log lama bukan verifikasi HEAD.

**Cara Verifikasi:**
Pada pekerjaan lanjutan yang mengizinkan build/server, periksa convention yang terdeteksi, matcher efektif, auth redirect, route publik, metadata/sitemap, dan hasil build Cache Components. Dalam audit ini tidak dijalankan.

**Rekomendasi Perbaikan:**
Selaraskan satu entry proxy di lokasi konvensi yang benar setelah verifikasi; gunakan guide Next lokal. Jangan menambahkan force-dynamic yang tidak sesuai cacheComponents.

**Risiko Perbaikan:**
Perubahan matcher bisa mengenai auth, upload, static assets, dan prefetch; uji seluruh boundary terlebih dahulu.

**Confidence:** Medium

---

### [ ] AUDIT-030 — Dokumen audit lama yang tracked memuat nilai secret autentikasi historis

**Prioritas:** P1

**Kategori:** Security

**Status:** Need Verification

**Modul:** Dokumentasi/secrets

**Lokasi Kode:**
- `AUDIT.md:55-64`
- `.gitignore:33-34`
- `src/auth.ts:15-15`

**Masalah:**
AUDIT.md berisi literal secret historis dan fragmen connection string; git ls-files menunjukkan dokumen tracked. Nilainya sengaja tidak disalin ke laporan ini. Pemakaian saat ini dan cakupan distribusinya belum diketahui.

**Penyebab Teknis:**
Mengabaikan .env tidak mencegah salinan credential masuk ke dokumen. Aplikasi kini membaca AUTH_SECRET, sedangkan dokumen menyebut nama lama.

**Dampak:**
Jika nilai historis masih aktif/dipakai ulang dan repo tersebar, autentikasi atau layanan terkait berisiko. Tidak ada bukti secret produksi aktif atau kompromi.

**Bukti:**
Section environment pada AUDIT.md mencantumkan nilai, bukan placeholder yang dijelaskan sebagai contoh. Tidak membaca atau menguji credential production untuk validasi.

**Cara Verifikasi:**
Pengelola membandingkan secara privat dengan secret aktif dan inventaris distribusi repo/history; jangan mencetak nilai pada chat/log atau mencoba koneksi.

**Rekomendasi Perbaikan:**
Jika aktif/dipakai ulang, rotasi melalui prosedur pengelola dan tangani salinan dokumen/history secara terencana. Bila dummy, tandai contoh agar tidak dianggap credential nyata.

**Risiko Perbaikan:**
Rotasi secret membatalkan session; perubahan history memerlukan koordinasi semua checkout. Tidak dilakukan dalam audit.

**Confidence:** Medium

---

### G. Regression Testing Checklist

Checklist ini adalah rencana pengujian setelah perbaikan mendapat instruksi terpisah. **Belum ada item yang dijalankan dalam audit ini.** Gunakan database fixture dan storage terisolasi, bukan production.

#### Authentication dan akses

- [ ] Login admin aktif: credentials benar/salah, email kosong/invalid, akun tidak aktif, error DB, dan kegagalan jaringan; pesan tidak membocorkan keberadaan akun.
- [ ] Anonymous, cookie invalid, token kedaluwarsa, dan role tidak diizinkan: buka semua route admin, lakukan navigasi client/prefetch/RSC, panggil setiap server action serta upload; pastikan tidak ada data privat atau write yang berhasil.
- [ ] Nonaktifkan akun/ganti password setelah login pada fixture: session lama ditolak menurut kebijakan pencabutan; logout menghapus session dan tidak dapat kembali dengan token lama.
- [ ] Mock flag on/off pada development dan production build: mock tidak aktif pada production; cookie mock tidak memberikan akses production.
- [ ] Cookie di staging HTTPS: secure/httpOnly/sameSite, expiry/renewal dan trusted host benar. Verifikasi limiter/WAF dengan prosedur aman; gunakan akun dummy.
- [ ] Pemulihan password: UI sesuai prosedur nyata. Bila kelak diimplementasikan, uji token invalid/expired/single-use, pengiriman email gagal, dan pembatalan session lama.
- [ ] Kedua role lama memiliki hak sesuai kebijakan transisi satu Admin; akun seed/role lama tidak terkunci tanpa prosedur recovery.

#### CRUD dashboard dan propagasi publik

- [ ] **Berita:** create draft/published, edit tanpa mengubah slug existing, publish/unpublish/archive/delete; duplicate judul, judul Unicode, excerpt panjang, konten kosong. Bandingkan /news, detail, home latest news, dan sitemap setelah mutasi.
- [ ] **Berita search:** q cocok/tidak cocok, kategori valid/invalid/berulang, gabungan q/kategori, pergantian filter, hasil kosong dan featured item.
- [ ] **Agenda:** create/edit/delete/toggle, tanggal valid/invalid dan end sebelum start; sukses tampil jelas dan create tidak terulang. Verifikasi /events, detail, home, dan sitemap.
- [ ] **Waktu:** browser Jakarta dengan server UTC, lintas hari/bulan/tahun, edit/save tanpa mengubah jam; pastikan WIB konsisten pada input/list/detail dan agenda beberapa hari belum disebut selesai.
- [ ] **Anggota:** create/edit/delete, email invalid/duplikat/variasi kapital/spasi, institusi kosong/tidak ditemukan; foto/detail URL dan privasi emailPublic. Periksa /members, /universities/[slug], statistik home, serta posisi kepengurusan setelah anggota dihapus.
- [ ] **Kampus:** create/edit/delete, nama/slug duplicate, pencarian, kampus kosong/beranggota; cek direct detail by slug/id dan jumlah anggota. Rename kampus harus segera tercermin di direktori anggota/kampus.
- [ ] **Kepengurusan:** create/edit/aktif/nonaktif/delete periode, create/edit/delete posisi, anggota opsional, urutan integer/rentang, cascade periode dan SetNull anggota. Uji hanya satu aktif termasuk dua operasi bersamaan.
- [ ] **Form posisi:** edit A → edit B → batal → tambah, input belum disimpan, refresh, invalid positionId dan record dihapus admin lain; payload tidak memakai nilai/ID target lama.
- [ ] **Kepengurusan publik:** pencarian tetap di route yang benar, hasil sesuai query, periode aktif/posisi kosong, dan keadaan tanpa periode aktif. Dashboard tidak boleh menganggap fallback periode nonaktif sebagai aktif.
- [ ] **Publikasi:** create/edit/delete untuk semua tipe; tanggal null/lampau/masa depan menurut kebijakan, deskripsi, externalUrl/fileUrl fallback; pastikan hanya satu sumber query dan visibilitas publik mengikuti aturan.
- [ ] **Galeri:** create/edit/delete foto/video, featured/sortOrder/kategori, video YouTube invalid/valid; thumbnail publik benar, preview admin dan link video tetap bekerja, empty state konsisten.
- [ ] **Sinkronisasi:** sesudah CRUD, cek tab publik baru dan tab yang sudah terbuka, detail record lama, invalidasi cache tag, serta respons setelah DB gagal. Home carousel statis tetap mengikuti kontrak terpisah di README.
- [ ] **Concurrent edits:** dua admin mengedit record yang sama, toggle bersamaan, delete sewaktu edit, duplicate create; periksa apakah perlu deteksi konflik untuk mencegah perubahan tertimpa.
- [ ] **Pagination/performance:** daftar besar di seluruh modul, waktu query/ukuran HTML/RSC, lookup relasi dan filter; prioritaskan take/skip/cursor setelah pengukuran. Query list sekarang umumnya tidak dibatasi; belum dibuktikan lambat pada volume aktual.

#### Upload, kegagalan, accessibility, SEO dan deployment

- [ ] Upload PNG/JPEG/WebP valid; kosong, >1 MB, extension/MIME/signature tidak cocok, filename invalid, file terpotong, dan gambar dengan dimensi ekstrem. Pastikan response 400/401/413/415/500 konsisten.
- [ ] Request multipart gagal, proxy membatasi body, koneksi putus, respons bukan JSON, filesystem tidak writable/penuh; UI memulihkan tombol dan nilai form.
- [ ] Batas ukuran request **sebelum** multipart di-buffer diverifikasi di hosting: batas file sesudah req.formData bukan jaminan batas seluruh body.
- [ ] Upload sesudah server startup, restart/redeploy, akses lintas instance, backup/restore media; file yang diganti/dihapus dan upload dibatalkan mengikuti kebijakan cleanup tanpa menghapus aset bersama.
- [ ] Semua form: double-click/Enter, promise action rejected, session expired saat submit, action commit tetapi respons hilang; tidak ada retry otomatis yang menciptakan duplikasi.
- [ ] Database unavailable: read/list/detail/dashboard/sitemap serta auth menunjukkan perilaku terkontrol; restore koneksi memungkinkan pemulihan. Loading bukan pengganti error recovery; belum ditemukan error.tsx/global-error.tsx khusus aplikasi.
- [ ] Teks HTML berita/agenda dirender melalui sanitizer; input URL memakai scheme yang disepakati. Periksa encoding teks dan jangan menyimpulkan XSS dari string saja.
- [ ] Semua submenu/hash, direct navigation, URL detail tidak ditemukan, sitemap/robots/canonical origin, metadata dan share URL.
- [ ] Pastikan direktori kampus tidak duplikat; landmark main/heading dan label input benar; modal confirmation/preview dapat dipakai keyboard, focus tidak keluar tanpa sengaja, Escape/cancel bekerja dan accessible name tersedia.
- [ ] Responsive/browser: 320/375/768/1024/1440 px, zoom 200%, teks panjang, menu mobile/sidebar, tabel overflow, gambar gagal, sticky header/anchor tidak tertutup; Chrome/Firefox/Safari sesuai target pengelola. Tidak ada evaluasi redesign visual.
- [ ] Carousel home dapat dioperasikan keyboard dan dihentikan sesuai kebutuhan accessibility/reduced motion; interval/event listener bersih setelah unmount.
- [ ] Saat diizinkan pada tahap berikutnya: fresh checkout/install dari lockfile, validasi migration pada DB uji, generate Prisma, lint/typecheck/build/test yang relevan dan smoke test staging. Log build lama tidak dianggap hasil verifikasi source sekarang.
- [ ] Env wajib tersedia dengan nilai benar; env placeholder tidak dipakai produksi; origin metadata bukan localhost. Runtime Node/deployment, entry proxy, HTTPS, database backup/restore, secret management dan SOP akun/media disepakati sebelum handover.

### H. Audit Coverage & Limitations

#### Cakupan yang diperiksa

| Area | Pemeriksaan statis | Batas yang tersisa |
| --- | --- | --- |
| Discovery/config | Struktur file, manifest/lockfile, strict TS, Next config, env template/nama env, README, AGENTS, SQL migrations, compose, log historis | Runtime produksi, konfigurasi hosting dan state DB tidak dibaca |
| Auth | Credentials → User → bcrypt → JWT/session → guard, admin layout, middleware/proxy, login/logout/mock, forgot/reset | Cookie/expiry/renewal/HTTPS/WAF dan respons RSC belum diuji |
| Berita | List/filter/new/edit, NewsForm, toggle/delete, action CRUD, reader/filter status/sanitizer, home/detail/sitemap | Runtime cache, jaringan/DB failure dan data nyata |
| Agenda | Form/upload/waktu, list/filter/new/edit/toggle/delete, action CRUD, list/detail/home/sitemap | Timezone deployment, hydration dan status berjalan perlu pengujian |
| Anggota | Form/read/search/filter/upload/delete, standalone profile, FK kampus, penggunaan publik/management | Nilai data lama, concurrency dan aturan email bisnis |
| Kepengurusan | Periode/posisi CRUD, transaksi aktif, edit via query param, cascade/SetNull, reader publik/search | Race condition, preservation state lintas navigasi dan invariant DB nyata |
| Kampus | Form/logo CRUD, search, larangan delete beranggota, slug/id fallback, direktori/member detail | Race delete/create anggota dan query performance |
| Publikasi | Form/action/type/date, reader terfilter, komponen query kedua, kategori/search/tautan publik | Kebijakan tanggal/visibilitas final harus disepakati |
| Galeri/media | Form/action/upload, list/filter/delete/preview, reader publik, thumbnail video, carousel statis | Serving/persistensi/cleanup media pada hosting |
| Publik/shared UI | Route/layout/navbar/mobile/footer, shell/nav/share, state kosong/loading, gambar/aset utama, SEO sitemap/robots | Audit visual/DOM hidup, screen reader, browser dan responsive belum dilakukan |
| Security/reliability | Guard mutasi/upload, input/runtime validation, sanitized HTML sinks, query ORM, error handling, relasi, transaksi, cache invalidation | Bukan penetration test, bukan sertifikasi aman, bukan pemindaian CVE |

Tidak ada modul registrasi publik, pengaturan admin/CRUD akun, dokumen unduhan, ContactMessage/inbox, atau service backend terpisah pada implementasi aktif yang ditemukan. Referensi model/modul lama pada AGENTS/AUDIT tidak digunakan sebagai bukti bahwa fitur tersebut masih tersedia. Kontak sekarang berupa informasi statis dan tautan; tidak ada alur submit pesan yang bisa ditelusuri.

#### Batasan dan risiko yang belum dapat dipastikan

- Audit statis menelusuri jalur utama dan cabang penting; tidak menjamin setiap baris seluruh repository/dependensi diperiksa atau semua defect ditemukan. File generated/vendor hanya dibaca secara terarah untuk memeriksa konvensi auth/Next; bukan audit seluruh framework.
- Tidak menjalankan build, lint, typecheck, test, Prisma CLI, seed/migration, install dependency, server, browser automation, exploit, scan aktif, atau request production. Tidak mengakses koneksi database maupun API eksternal. Skenario Cara Verifikasi dan checklist adalah pekerjaan berikutnya, bukan hasil eksekusi.
- Tidak memeriksa nilai .env aktif. Dokumen historis yang mengandung credential tidak disalin nilainya. Validitas email/domain/map/akun sosial resmi, keaktifan secret lama, konfigurasi jaringan, quota upload, backup dan observability hosting harus dikonfirmasi pengelola.
- Tidak dapat memastikan jumlah data, execution plan, N+1 aktual, waktu respons, load capacity, pool/timeouts PostgreSQL, durasi cache yang teramati, atau memory leak runtime. List findMany tanpa pagination dan latest news mengambil semua row lalu slice menjadi kandidat pengukuran, bukan confirmed bottleneck.
- Sanitizer pada detail dan guard mutasi adalah kontrol yang ditemukan, bukan bukti bebas XSS/injection/CSRF/IDOR. Scheme URL, auth read/prefetch, request multipart berukuran besar, signature file yang hanya memeriksa header, dan efek cookie pada topologi hosting tetap perlu diuji secara terisolasi.
- Persyaratan satu Admin dibandingkan dengan dua role kode dicatat sebagai mismatch kebutuhan; tidak menyimpulkan SUPER_ADMIN memberikan hak tambahan atau anggota bisa login. User tidak terhubung ke MemberProfile.
- `build-log.txt` adalah artefak historis dengan path lama; error tersebut tidak dilaporkan ulang sebagai bug saat ini. Tidak ada klaim build source sekarang berhasil ataupun gagal.
- Rekomendasi pagination, deteksi lost update, deduplikasi slug/parser, pruning dependency/icon library, penyederhanaan service stub, dan modernisasi convention hanya dilakukan bila bukti/target operasional mendukung. Tidak dijadikan defect semata karena preferensi gaya.
- Audit tidak mengubah mekanisme auth, schema, migration, konfigurasi/env, source UI/backend, atau database. **Satu-satunya file yang dibuat/diubah adalah `TODO.md`.** Perbaikan memerlukan instruksi lanjutan.

#### Urutan tindak lanjut yang disarankan

1. Tinjau AUDIT-001–003 dan sepakati kebijakan session, pemulihan akun, serta visibilitas publikasi.
2. Verifikasi secara privat AUDIT-030 dan infrastruktur AUDIT-024/025/027/029 sebelum menyatakan siap production.
3. Perbaiki defect P2 secara bertahap dengan skenario verifikasi per temuan, terutama timezone, search, thumbnail, feedback submit, dan URL sitemap/navigation.
4. Jalankan checklist regresi pada lingkungan terisolasi setelah izin pengujian/perbaikan diberikan; catat hasil dan tutup checklist temuan hanya setelah bukti verifikasi tersedia.

