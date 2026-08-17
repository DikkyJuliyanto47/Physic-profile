"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isMockAuthEnabled, setMockAuthCookie } from "@/lib/mock-auth";

export default function LoginPage() {
  const router = useRouter();
  const isMockMode = isMockAuthEnabled();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // The JWT configuration has one global session lifetime. Per-login expiry
  // requires a server-side session/token-expiry contract before this can apply.
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
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-[#3D63E8] to-[#0C1638] p-12 text-white lg:flex">
        <div className="flex h-56 w-56 items-center justify-center rounded-xl bg-[#F3F6FF] p-8">
          <Image
            src="/assets/logo/navbar/psi-indonesia.png"
            alt="Physical Society of Indonesia"
            width={176}
            height={176}
            className="h-full w-full object-contain"
          />
        </div>

        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Kelola PSI Surabaya
          </h2>
          <p className="mt-2 text-sm text-blue-100">
            Masuk untuk mengelola informasi dan konten organisasi.
          </p>
        </div>

        <p className="text-xs text-blue-200">
          © 2026 Physical Society of Indonesia Cabang Surabaya
        </p>
      </div>

      <div className="flex w-full items-center justify-center bg-neutral-50 px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary-600">
            Selamat Datang
          </p>
          <h1 className="mt-1 text-2xl font-bold text-neutral-900">
            Masuk ke Admin Panel
          </h1>

          <p className="mt-1 text-sm text-neutral-500">
            Gunakan akun admin Anda untuk melanjutkan.
          </p>

          {isMockMode && (
            <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5">
              <button
                type="button"
                onClick={handleMockLogin}
                disabled={isLoading}
                className="text-sm font-semibold text-amber-800 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                Masuk sebagai Admin (Testing)
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-semibold text-neutral-900"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="mailto@gmail.com"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-semibold text-neutral-900"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••••••••••"
                className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-neutral-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-300"
                />
                Ingat saya
              </label>
              <span
                aria-disabled="true"
                title="Fitur lupa kata sandi belum tersedia."
                className="cursor-not-allowed font-medium text-primary-600 opacity-60"
              >
                Lupa kata sandi?
              </span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Masuk..." : "Masuk"}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-3 text-sm font-medium text-neutral-900">
            <span className="h-px flex-1 bg-neutral-300" />
            <span>PSI Surabaya</span>
            <span className="h-px flex-1 bg-neutral-300" />
          </div>

          <p className="mt-3 text-center text-sm text-neutral-500">
            Physical Society of Indonesia Cabang Surabaya
          </p>
        </div>
      </div>
    </div>
  );
}
