"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const passwordsMatch = password.length > 0 && password === confirmation;
  const isStrongEnough = password.length >= 8;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (!isStrongEnough) {
      setError("Password harus memiliki minimal 8 karakter.");
      return;
    }

    if (!passwordsMatch) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsSuccess(true);
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
              Reset Kata Sandi
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Buat kata sandi baru
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Masukkan kata sandi baru untuk akun admin Anda.
            </p>
          </header>

          {isSuccess ? (
            <div className="mt-8">
              <div className="rounded-md border border-green-200 bg-green-50 px-4 py-4">
                <p className="text-sm font-medium text-green-900">
                  Kata sandi berhasil diperbarui.
                </p>
                <p className="mt-1 text-sm leading-5 text-green-700">
                  Anda sekarang dapat masuk menggunakan kata sandi baru.
                </p>
              </div>

              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 transition-colors hover:text-primary-600 focus:text-primary-600 focus:outline-none"
              >
                <span aria-hidden="true">←</span>
                Kembali ke login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div
                  role="alert"
                  className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
                >
                  {error}
                </div>
              )}

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-neutral-900"
                >
                  Kata sandi baru
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Masukkan password baru"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
                <div className="mt-2 flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((item) => (
                    <span
                      key={item}
                      className={`h-1 flex-1 rounded-full ${
                        password.length >= (item + 1) * 2
                          ? "bg-primary-500"
                          : "bg-neutral-200"
                      }`}
                    />
                  ))}
                  <span
                    className={`ml-1 text-xs font-medium ${
                      isStrongEnough ? "text-green-600" : "text-neutral-400"
                    }`}
                  >
                    {isStrongEnough ? "Kuat" : "Min. 8 karakter"}
                  </span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmation"
                  className="mb-2 block text-sm font-medium text-neutral-900"
                >
                  Konfirmasi kata sandi
                </label>
                <input
                  id="confirmation"
                  type="password"
                  value={confirmation}
                  onChange={(e) => setConfirmation(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="Ulangi password baru"
                  className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3.5">
                <p className="text-sm font-medium text-neutral-800">
                  Persyaratan password
                </p>
                <ul className="mt-2 space-y-1.5 text-xs text-neutral-500">
                  <li className={password.length >= 8 ? "text-green-600" : ""}>
                    {password.length >= 8 ? "✓" : "•"} Minimal 8 karakter
                  </li>
                  <li>
                    {password.length > 0 && passwordsMatch ? "✓" : "•"}{" "}
                    Konfirmasi password harus sesuai
                  </li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="h-11 w-full rounded-md bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? "Menyimpan..." : "Simpan kata sandi baru"}
              </button>

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