"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  MOCK_AUTH_USER,
  clearMockAuthCookie,
  isMockAuthEnabled,
} from "@/lib/mock-auth";

interface AdminTopbarProps {
  sidebarOpen?: boolean;
  onMenuToggle?: () => void;
}

export function AdminTopbar({
  sidebarOpen = true,
  onMenuToggle,
}: AdminTopbarProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isMockMode = isMockAuthEnabled();
  const user = session?.user ?? (isMockMode ? MOCK_AUTH_USER : undefined);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function handleLogout() {
    setMenuOpen(false);

    if (isMockMode) {
      clearMockAuthCookie();
      router.push("/login");
      router.refresh();
      return;
    }

    await signOut({ callbackUrl: "/login" });
  }

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-40 flex h-17 items-center border-b border-neutral-200 bg-white transition-[left] duration-300 ease-in-out ${
        sidebarOpen ? "lg:left-66" : "lg:left-16"
      }`}
    >
      <div className="flex min-w-0 flex-1 items-center justify-between px-4 sm:px-6 lg:px-7">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuToggle}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-neutral-200 text-neutral-600 transition-colors hover:bg-neutral-50 lg:hidden"
            aria-label="Buka navigasi"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.7}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          <div className="hidden items-center gap-2 lg:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-600" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
              Admin Panel
            </span>
          </div>

          <span className="truncate text-sm font-semibold text-primary-900 lg:hidden">
            PSI Surabaya
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 rounded-md px-1.5 py-1.5 transition-colors hover:bg-neutral-50 sm:gap-2.5 sm:px-2"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-37.5 truncate text-sm font-semibold leading-5 text-neutral-900">
                  {user?.name ?? "User"}
                </p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-neutral-400">
                  {user?.role ?? "ADMIN"}
                </p>
              </div>

              <svg
                className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ${
                  menuOpen ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.8}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m6 9 6 6 6-6"
                />
              </svg>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 w-[min(260px,calc(100vw-32px))] overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-[0_8px_24px_rgba(15,23,42,0.08)]"
              >
                <div className="border-b border-neutral-100 px-4 py-3">
                  <p className="truncate text-sm font-semibold text-neutral-900">
                    {user?.name ?? "User"}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-neutral-500">
                    {user?.email ?? "-"}
                  </p>
                </div>

                <div className="p-1.5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                  >
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.7}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
                      />
                    </svg>
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}