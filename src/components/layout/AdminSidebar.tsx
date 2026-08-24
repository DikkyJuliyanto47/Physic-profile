"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/layout/";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { label: "Berita & Pengumuman", href: "/admin/news", icon: "M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" },
  { label: "Agenda & Event", href: "/admin/events", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Anggota & Pengurus", href: "/admin/members", icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" },
  { label: "Kepengurusan", href: "/admin/managements", icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Perguruan Tinggi", href: "/admin/universities", icon: "M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" },
  { label: "Riset & Publikasi", href: "/admin/publication", icon: "M12 6.253v11.494m0-11.494a4.5 4.5 0 00-4.5-4.5v15.994a4.5 4.5 0 014.5 4.5m0-15.994a4.5 4.5 0 014.5-4.5v15.994a4.5 4.5 0 00-4.5 4.5m-4.5-4.5h9" },
  { label: "Dokumen & Sumber Daya", href: "/admin/documents", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { label: "Galeri & Media", href: "/admin/gallery", icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" },
  { label: "Pesan Kontak", href: "/admin/messages", icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
];

interface AdminSidebarProps {
  onToggle?: (isOpen: boolean) => void;
}

export function AdminSidebar({ onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onToggle?.(newState);
  };

  return (
    <>
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-primary-950 transition-all duration-300 ease-in-out ${
          isOpen ? "w-72" : "w-16"
        }`}
      >
        <div className={`flex h-16 items-center gap-2 border-b border-primary-800 bg-white px-6 ${!isOpen && "px-2"}`}>
          {isOpen ? (
            <>
              <Link href="/" className="shrink-0">
                <BrandMark />
              </Link>
              <span className="text-sm font-semibold text-white">Surabaya CMS</span>
            </>
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Link href="/" className="shrink-0">
                <BrandMark />
              </Link>
            </div>
          )}
        </div>

        <nav className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
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
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary-800 text-white"
                        : "text-primary-200 hover:bg-primary-800/50 hover:text-white"
                    } ${!isOpen && "justify-center px-0"}`}
                  >
                    <svg
                      className="h-5 w-5 shrink-0"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={item.icon}
                      />
                    </svg>
                    {isOpen && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`border-t border-primary-800 px-6 py-4 ${!isOpen && "px-2"}`}>
          {isOpen ? (
            <p className="text-xs text-primary-400">
              &copy; {new Date().getFullYear()} PSI Surabaya
            </p>
          ) : (
            <p className="text-center text-xs text-primary-400">
              &copy; {new Date().getFullYear().toString().slice(-2)}
            </p>
          )}
        </div>
      </aside>

      <button
        onClick={toggleSidebar}
        className="fixed top-20 z-50 hidden items-center justify-center rounded-full border border-neutral-200 bg-white p-1.5 shadow-md transition-all hover:bg-neutral-50 lg:flex"
        style={{ left: isOpen ? "calc(18rem - 12px)" : "calc(4rem - 12px)" }}
        aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"}
      >
        <svg
          className={`h-4 w-4 text-neutral-600 transition-transform duration-300 ${isOpen ? "rotate-0" : "rotate-180"}`}
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </>
  );
}