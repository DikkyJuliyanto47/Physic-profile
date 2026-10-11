import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden w-1/2 overflow-hidden bg-[#0C1638] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(61,99,232,0.3),transparent_42%)]" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-10">
          <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-8 xl:h-72 xl:w-72 xl:p-10">
            <Image
              src="/assets/logo/navbar/psi-indonesia.png"
              alt="Physical Society of Indonesia"
              width={320}
              height={320}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        <div className="relative z-10 max-w-xl px-10 pb-10 xl:px-12 xl:pb-12">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">
            Admin Panel
          </p>
          <h2 className="max-w-lg text-3xl font-semibold leading-tight tracking-tight text-white xl:text-4xl">
            Kelola PSI Cabang Surabaya.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-300">
            Kelola berita, agenda, publikasi, galeri, dan informasi organisasi
            melalui satu panel administrasi.
          </p>
        </div>

        <div className="relative z-10 border-t border-white/10 px-10 py-5 xl:px-12">
          <p className="text-xs text-slate-400">
            © 2026 Physical Society of Indonesia Cabang Surabaya
          </p>
        </div>
      </aside>

      <main className="flex w-full items-center justify-center bg-neutral-50 px-6 py-10 lg:w-1/2 lg:bg-white lg:px-12">
        <div className="w-full max-w-100">
          <div className="mb-8 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-neutral-200 bg-white p-2">
              <Image
                src="/assets/logo/navbar/psi-indonesia.png"
                alt="Physical Society of Indonesia"
                width={120}
                height={120}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          <Link
            href="/login"
            className="flex justify-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 focus:text-primary-800 focus:outline-none"
          >
            <span aria-hidden="true">←</span>
            Kembali ke login
          </Link>

          <header className="mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
              Lupa Kata Sandi
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Pemulihan akun manual
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Pemulihan kata sandi dilakukan secara manual melalui pengelola sistem yang berwenang.
            </p>
          </header>

          <div className="mt-8 space-y-5">
            <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-4">
              <p className="text-sm font-medium text-blue-900">
                Hubungi pengelola sistem
              </p>
              <p className="mt-1 text-sm leading-5 text-blue-700">
                Hubungi pengelola sistem yang berwenang untuk meminta bantuan
                pemulihan akses akun admin. Pemulihan mandiri belum tersedia;
                halaman ini tidak mengirim email atau mengubah kata sandi.
              </p>
            </div>

            <Link
              href="/login"
              className="flex justify-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 focus:text-primary-800 focus:outline-none"
            >
              Kembali ke halaman login
            </Link>
          </div>

          <footer className="mt-10 border-t border-neutral-200 pt-5">
            <p className="text-center text-xs leading-5 text-neutral-400">
              Physical Society of Indonesia Cabang Surabaya
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}