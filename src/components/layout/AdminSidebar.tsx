"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BrandMark } from "@/components/layout/";

const NAV_ITEMS = [
  {
    label: "Overview",
    href: "/admin",
    icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
  },
  {
    label: "Sumber Daya",
    href: "/admin/documents",
    icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
  {
    label: "Berita",
    href: "/admin/news",
    icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z",
  },
  {
    label: "Agenda",
    href: "/admin/events",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2 0 002 2z",
  },
  {
    label: "Anggota",
    href: "/admin/members",
    icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
  },
  {
    label: "Kepengurusan",
    href: "/admin/managements",
    icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
  {
    label: "Perguruan Tinggi",
    href: "/admin/universities",
    icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222",
  },
  {
    label: "Riset & Publikasi",
    href: "/admin/publication",
    icon: "M12 6.253v11.494m0-11.494a4.5 4.5 0 00-4.5-4.5v15.994a4.5 4.5 0 014.5 4.5m0-15.994a4.5 4.5 0 014.5-4.5v15.994a4.5 4.5 0 00-4.5 4.5m-4.5-4.5h9",
  },
  {
    label: "Galeri",
    href: "/admin/gallery",
    icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z",
  },
];

interface AdminSidebarProps {
  isOpen: boolean;
  pinned: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onPinnedChange: (pinned: boolean) => void;
}

export function AdminSidebar({
  isOpen,
  pinned,
  onOpenChange,
  onPinnedChange,
}: AdminSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && window.innerWidth < 1024 && isOpen) {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onOpenChange]);

  const handleMouseEnter = () => {
    if (!pinned) onOpenChange(true);
  };

  const handleMouseLeave = () => {
    if (!pinned && window.innerWidth >= 1024) {
      onOpenChange(false);
    }
  };

  const handleToggle = () => {
    if (pinned) {
      onPinnedChange(false);
      onOpenChange(false);
      return;
    }

    onPinnedChange(true);
    onOpenChange(true);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Tutup navigasi"
        onClick={() => onOpenChange(false)}
        className={`fixed inset-0 z-40 bg-primary-950/20 transition-opacity duration-300 lg:hidden ${
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <div
        aria-hidden="true"
        className="fixed inset-y-0 left-0 z-55 hidden w-3 lg:block"
        onMouseEnter={() => {
          if (!pinned) onOpenChange(true);
        }}
      />

      <aside
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-primary-950 transition-[width,transform] duration-300 ease-out ${
          isOpen ? "w-66" : "w-16"
        } ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div
          className={`flex h-17 shrink-0 items-center border-b border-neutral-200 bg-white ${
            isOpen ? "px-4" : "justify-center px-2"
          }`}
        >
          <Link
            href="/"
            aria-label="Physical Society of Indonesia Cabang Surabaya"
            className="min-w-0"
          >
            <BrandMark
              variant="dark"
              showText={isOpen}
              className={isOpen ? "" : "justify-center"}
            />
          </Link>
        </div>

        <nav
          aria-label="Navigasi administrasi"
          className="flex-1 overflow-y-auto px-2.5 py-5"
        >
          <div className="mb-3 px-3">
            {isOpen && (
              <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-400">
                Workspace
              </span>
            )}
          </div>

          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    title={!isOpen ? item.label : undefined}
                    className={`group relative flex h-10 items-center gap-3 rounded-md text-sm font-medium transition-colors ${
                      isOpen ? "px-3" : "justify-center px-0"
                    } ${
                      isActive
                        ? "bg-primary-700 text-white"
                        : "text-primary-200 hover:bg-primary-800/70 hover:text-white"
                    }`}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-2.5 h-5 w-0.5 rounded-r-full bg-white" />
                    )}

                    <svg
                      className={`h-4.5 w-4.5 shrink-0 ${
                        isActive
                          ? "text-white"
                          : "text-primary-300 group-hover:text-white"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.6}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.icon}
                      />
                    </svg>

                    {isOpen && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-primary-800/80 p-3">
          <div
            className={`flex items-center ${
              isOpen ? "justify-between gap-3" : "justify-center"
            }`}
          >
            {isOpen && (
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-400">
                  Physical Society of Indonesia Cabang Surabaya
                </p>
                <p className="mt-0.5 text-[10px] text-primary-500">
                  {new Date().getFullYear()}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleToggle}
              title={pinned ? "Ciutkan sidebar" : "Kunci sidebar terbuka"}
              aria-label={pinned ? "Ciutkan sidebar" : "Kunci sidebar terbuka"}
              aria-pressed={pinned}
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border transition-colors ${
                pinned
                  ? "border-primary-700 bg-primary-800 text-white"
                  : "border-primary-800 text-primary-400 hover:bg-primary-800 hover:text-white"
              }`}
            >
              <svg
                className={`h-4 w-4 transition-transform duration-300 ${
                  pinned ? "" : "rotate-180"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.7}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.5 6-6 6 6 6"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            if (window.innerWidth < 1024) {
              onOpenChange(false);
              return;
            }

            handleToggle();
          }}
          className={`absolute top-20.5 -right-3 hidden h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-600 shadow-[0_2px_8px_rgba(15,23,42,0.10)] transition-all hover:bg-neutral-50 lg:flex ${
            isOpen ? "" : "-right-3"
          }`}
          aria-label={isOpen ? "Ciutkan sidebar" : "Buka sidebar"}
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-300 ${
              isOpen ? "" : "rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m14.5 6-6 6 6 6"
            />
          </svg>
        </button>
      </aside>
    </>
  );
}