"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsSubmitted(true);
    setIsLoading(false);
  }

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
              Reset kata sandi
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Masukkan email admin Anda. Kami akan mengirimkan tautan untuk
              mengatur ulang kata sandi.
            </p>
          </header>

          {isSubmitted ? (
            <div className="mt-8">
              <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-4">
                <p className="text-sm font-medium text-blue-900">
                  Periksa email Anda
                </p>
                <p className="mt-1 text-sm leading-5 text-blue-700">
                  Jika email tersebut terdaftar, tautan untuk mengatur ulang
                  kata sandi telah dikirim ke email Anda.
                </p>
              </div>

              <p className="mt-5 text-center text-sm text-neutral-500">
                Tidak menerima email? Periksa folder spam atau{" "}
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  coba lagi
                </button>
                .
              </p>

              <Link
                href="/login"
                className="flex justify-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 focus:text-primary-800 focus:outline-none"
              >
                Kembali ke login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-neutral-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="nama@email.com"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="rounded-md border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-sm leading-5 text-blue-800">
                  Jika email terdaftar, tautan reset akan dikirim ke email
                  Anda.
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-md bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Mengirim..." : "Kirim tautan reset"}
              </button>

              <div className="flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs text-neutral-400">atau</span>
                <span className="h-px flex-1 bg-neutral-200" />
              </div>

              <Link
                href="/login"
                className="flex justify-center text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 focus:text-primary-800 focus:outline-none"
              >
                Kembali ke halaman login
              </Link>
            </form>
          )}

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