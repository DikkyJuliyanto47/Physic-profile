# Component Architecture

Dokumen ini menjelaskan struktur folder komponen dan aturan penempatan
komponen. Tujuannya agar setiap developer tahu di mana sebuah komponen baru
seharusnya diletakkan, tanpa perlu berdiskusi ulang setiap kali.

## 1. Struktur Folder

```
src/components/
├── ui/
├── layout/
├── forms/
└── features/
```

## 2. ui/ — Komponen Generik

Komponen dasar yang tidak memiliki pengetahuan tentang domain bisnis apa pun.
Bisa dipakai di Public Website maupun Admin Panel tanpa modifikasi.

Contoh: `Button`, `Input`, `Card`, `Badge`, `Dialog`, `Table`.

Ciri komponen yang masuk ke `ui/`:

- Menerima semua data melalui props
- Tidak tahu konteks halaman tempatnya dipakai
- Tidak memanggil data layer atau business logic apa pun

## 3. layout/ — Komponen Struktur Halaman

Komponen yang membentuk kerangka visual halaman, dipakai oleh `layout.tsx`
pada masing-masing Route Group.

Contoh: `PublicNavbar`, `PublicFooter`, `AdminSidebar`, `AdminHeader`,
`Container`.

Ciri komponen yang masuk ke `layout/`:

- Berkaitan dengan struktur halaman, bukan konten domain
- Boleh menggunakan komponen dari `ui/`
- Tidak boleh berisi logic domain (mis. daftar berita) — jika butuh
  menampilkan data domain, komponen tersebut sebaiknya masuk ke `features/`

## 4. forms/ — Komponen Form Reusable

Komponen form yang dapat dipakai ulang, baik struktur input maupun pola
validasi tampilan (bukan logic validasi backend).

Ciri komponen yang masuk ke `forms/`:

- Berupa kumpulan input yang membentuk satu form
- Bisa dipakai lebih dari satu tempat (mis. form yang sama untuk create dan
  edit)
- Menggunakan komponen dari `ui/` sebagai building block

## 5. features/ — Komponen Berbasis Domain

Komponen yang secara eksplisit terikat pada satu domain atau fitur tertentu,
dan menyusun (compose) komponen dari `ui/`, `layout/`, dan `forms/` menjadi
satu unit yang punya makna bisnis.

Contoh domain: `home`, `news`, `events`, `members`, `gallery`, `universities`.

Ciri komponen yang masuk ke `features/`:

- Namanya mencerminkan domain, bukan bentuk UI generik (mis. `NewsCard`,
  bukan `Card2`)
- Boleh menggunakan `ui/`, `layout/`, dan `forms/`
- Tidak boleh diimpor balik oleh `ui/`, `layout/`, atau `forms/`

## 6. Aturan Arah Ketergantungan

```
features/  ---->  forms/   ---->  ui/
features/  ---->  layout/  ---->  ui/
```

`ui/` adalah lapisan paling dasar dan tidak boleh bergantung pada folder lain
di atasnya. Aturan ini menjaga agar komponen generik tetap benar-benar
generik dan tidak diam-diam terikat pada satu domain.

## 7. Kapan Membuat Komponen Baru vs Reuse

Sebelum membuat komponen baru, periksa dulu:

1. Apakah kebutuhan ini sudah bisa dipenuhi oleh komponen di `ui/` dengan
   variasi props?
2. Jika komponen baru dibutuhkan, apakah sifatnya generik (masuk `ui/`) atau
   terikat domain (masuk `features/`)?
3. Jika hanya dipakai satu kali di satu halaman, pertimbangkan apakah memang
   perlu jadi komponen terpisah, atau cukup ditulis langsung di halaman
   tersebut.

Hindari membuat komponen baru hanya karena "mungkin nanti dipakai lagi".
Reuse muncul secara alami setelah ada kebutuhan konkret kedua, bukan
diasumsikan di awal.

## 8. Menghindari Overengineering

- Jangan membuat sub-kategori folder tambahan (mis. `ui/buttons/`,
  `ui/inputs/`) sebelum jumlah komponen benar-benar membutuhkannya.
- Jangan membuat abstraksi generik (mis. `BaseCard` dengan banyak variant)
  sebelum ada minimal dua kasus pemakaian nyata yang membutuhkannya.
- Satu komponen sebaiknya fokus pada satu tanggung jawab visual.
