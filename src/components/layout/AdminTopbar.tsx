"use client";

import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export function AdminTopbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = session?.user;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white px-4 sm:px-6 lg:px-8">
      <div className="lg:hidden">
        <span className="text-sm font-bold text-primary-900">PSI Surabaya</span>
      </div>

      <div className="flex-1" />

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-neutral-100"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
            {user?.name?.charAt(0) ?? "U"}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium text-neutral-900">
              {user?.name ?? "User"}
            </p>
            <p className="text-xs text-neutral-500">
              {user?.role ?? "MEMBER"}
            </p>
          </div>
          <svg
            className="h-4 w-4 text-neutral-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 z-50 mt-1 w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-elevated">
              <div className="border-b border-neutral-100 px-4 py-2">
                <p className="text-sm font-medium text-neutral-900">
                  {user?.name}
                </p>
                <p className="text-xs text-neutral-500">{user?.email}</p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                  />
                </svg>
                Keluar
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
