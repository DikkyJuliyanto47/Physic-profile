"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import type { NavItem } from "@/types";
import { Button } from "@/components/ui";

interface PublicMobileNavProps {
  items: NavItem[];
}

export function PublicMobileNav({ items }: PublicMobileNavProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<NavItem | null>(null);

  const closeMenu = () => {
    setIsOpen(false);
    setActiveItem(null);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(false);
    setActiveItem(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={isOpen}
        onClick={() => {
          setIsOpen((prev) => !prev);
          setActiveItem(null);
        }}
        className="flex h-10 w-10 items-center justify-center text-white transition-colors duration-150 hover:text-[#f59e0b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59e0b]"
      >
        {isOpen ? (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      <div className={`absolute inset-x-0 top-full border-t border-white/10 bg-[#073b5c] transition-[opacity,visibility,transform] duration-200 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"}`}>
        <div className="max-h-[calc(100svh-72px)] overflow-y-auto">
          {activeItem ? (
            <div className="px-5 py-5 sm:px-6">
              <button
                type="button"
                onClick={() => setActiveItem(null)}
                className="mb-5 flex items-center gap-3 text-[13px] font-bold uppercase tracking-[0.06em] text-white/65 transition-colors hover:text-[#f59e0b]"
              >
                <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
                  <path d="M10.5 3.5 6 8l4.5 4.5M6.5 8H13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Kembali
              </button>

              <div className="border-y border-white/10">
                {activeItem.children?.map((child) => (
                  <Link
                    key={child.href ?? child.label}
                    href={child.href ?? "#"}
                    onClick={closeMenu}
                    className="flex min-h-14 items-center border-b border-white/10 text-[15px] font-semibold text-white/95 last:border-b-0 hover:text-[#f59e0b]"
                  >
                    {child.label}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <nav className="px-5 py-4 sm:px-6" aria-label="Navigasi mobile">
              {items.map((item) => {
                const hasChildren = Boolean(item.children?.length);
                const isActive = item.href === pathname || item.children?.some((child) => child.href === pathname);

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href ?? "#"}
                      onClick={closeMenu}
                      className={`flex min-h-14 items-center border-b border-white/10 text-[15px] font-bold transition-colors duration-150 ${isActive ? "text-[#f59e0b]" : "text-white/95 hover:text-[#f59e0b]"}`}
                    >
                      {item.label}
                    </Link>
                  );
                }

                return (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => setActiveItem(item)}
                    className={`flex min-h-14 w-full items-center justify-between border-b border-white/10 text-left text-[15px] font-bold transition-colors duration-150 ${isActive ? "text-[#f59e0b]" : "text-white/95 hover:text-[#f59e0b]"}`}
                  >
                    {item.label}
                    <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4 text-white/45" aria-hidden="true">
                      <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                );
              })}

              <div className="pt-5">
                <Button href="/contact" size="small" fullWidth variant="primary" className="h-11 rounded-[3px] text-[14px] font-bold" onClick={closeMenu}>
                  Hubungi Kami
                </Button>
              </div>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}