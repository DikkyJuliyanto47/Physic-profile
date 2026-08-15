"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { isMockAuthEnabled, setMockAuthCookie } from "@/lib/mock-auth";

export default function LoginPage() {
  const router = useRouter();
  const isMockMode = isMockAuthEnabled();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-card">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-primary-900">PSI Surabaya</h1>
          <p className="mt-1 text-sm text-neutral-500">Masuk ke panel admin</p>
        </div>

        {isMockMode && (
          <div className="mb-6 space-y-3">
            <button
              type="button"
              onClick={handleMockLogin}
              disabled={isLoading}
              className="w-full rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm font-semibold text-amber-800 transition-colors hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Masuk sebagai Admin (Testing)
            </button>
            <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-400">
              <span className="h-px flex-1 bg-neutral-200" />
              <span>Testing</span>
              <span className="h-px flex-1 bg-neutral-200" />
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@psi-surabaya.or.id"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-neutral-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Masukkan password"
              className="w-full rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Masuk..." : "Masuk"}
          </button>
        </form>
      </div>
    </div>
  );
}
