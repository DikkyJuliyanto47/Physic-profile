import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tentang Kami | PSI Surabaya",
  description: "Tentang Perhimpunan Fisikawan Indonesia Cabang Surabaya.",
};

export default function TentangPage() {
  return (
    <div className="bg-neutral-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-white sm:text-4xl">Tentang Kami</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-200">
            Mengenal lebih dekat Perhimpunan Fisikawan Indonesia Cabang Surabaya
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Sejarah */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Sejarah</h2>
          <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card prose prose-lg max-w-none prose-p:text-neutral-600">
            <p>
              Perhimpunan Fisikawan Indonesia (PSI) merupakan organisasi profesi yang menaungi
              para fisikawan di Indonesia. PSI Cabang Surabaya adalah salah satu cabang yang
              berkedudukan di wilayah Jawa Timur, mewadahi dosen, peneliti, dan mahasiswa
              fisika dari berbagai perguruan tinggi.
            </p>
            <p>
              Didirikan dengan tujuan memajukan ilmu fisika dan aplikasinya, PSI Surabaya
              secara konsisten menyelenggarakan kegiatan seminar, workshop, kuliah tamu,
              dan pertemuan rutin untuk memperkuat jejaring akademik di Jawa Timur.
            </p>
          </div>
        </section>

        {/* Visi & Misi */}
        <section className="mb-12">
          <h2 className="mb-4 text-2xl font-bold text-neutral-900">Visi & Misi</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Visi</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                Menjadi wadah pengembangan ilmu fisika dan jejaring akademik yang unggul
                di wilayah Jawa Timur.
              </p>
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary-50">
                <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-neutral-900">Misi</h3>
              <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-neutral-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Menyelenggarakan seminar dan workshop berkala
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Memperkuat kolaborasi riset antar perguruan tinggi
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Mengembangkan jaringan anggota dan kaderisasi
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary-500" />
                  Meningkatkan publikasi ilmiah fisika Indonesia
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center">
          <h2 className="text-xl font-bold text-white">Tertarik Bergabung?</h2>
          <p className="mt-2 text-primary-100">
            Dosen, peneliti, dan mahasiswa fisika di Jawa Timur dipersilakan bergabung.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              href="/kontak"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-primary-700 transition-colors hover:bg-primary-50"
            >
              Hubungi Kami
            </Link>
            <Link
              href="/anggota"
              className="inline-flex items-center gap-2 rounded-lg border border-primary-400/40 bg-primary-800/50 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-primary-500/50"
            >
              Lihat Anggota
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
