"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isMockAuthEnabled, setMockAuthCookie } from "@/lib/mock-auth";

export default function LoginPage() {
  const router = useRouter();
  const isMockMode = isMockAuthEnabled();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (isMockMode) {
        setMockAuthCookie();
        router.push("/admin");
        router.refresh();
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email atau password salah.");
      } else {
        router.push("/admin");
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleMockLogin() {
    setError("");
    setIsLoading(true);

    try {
      setMockAuthCookie();
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Gagal masuk ke mode testing.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <aside className="relative hidden w-1/2 overflow-hidden bg-[#0C1638] lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(61,99,232,0.3),transparent_42%)]" />

        <div className="relative z-10 flex flex-1 items-center justify-center px-10">
          <div className="flex h-64 w-64 items-center justify-center rounded-2xl border border-white/15 bg-white/10 p-8 backdrop-blur-[2px] xl:h-72 xl:w-72 xl:p-10">
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

          <header>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
              Selamat Datang
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">
              Masuk ke Admin Panel
            </h1>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Gunakan akun admin Anda untuk melanjutkan.
            </p>
          </header>

          {isMockMode && (
            <div className="mt-7 flex items-center justify-between gap-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
                  Testing Mode
                </p>
                <p className="mt-0.5 text-xs leading-5 text-amber-700">
                  Login tanpa kredensial tersedia.
                </p>
              </div>

              <button
                type="button"
                onClick={handleMockLogin}
                disabled={isLoading}
                className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold text-amber-900 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Masuk sebagai Admin
              </button>
            </div>
          )}

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

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-neutral-900"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Masukkan password"
                className="h-11 w-full rounded-md border border-neutral-300 bg-white px-3.5 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 hover:border-neutral-400 focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              />
            </div>

            <div className="flex items-center justify-between gap-4 pt-1">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-300"
                />
                <span>Ingat saya</span>
              </label>

              <Link
                href="/forgot-password"
                className="text-sm font-medium text-primary-600 transition-colors hover:text-primary-800 focus:text-primary-800 focus:outline-none"
              >
                Lupa kata sandi?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-md bg-primary-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
          </form>

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