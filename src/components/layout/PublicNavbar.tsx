"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Button, Container } from "@/components/ui";
import { publicNav } from "@/config/site";
import type { NavItem } from "@/types";
import { BrandMark } from "@/components/layout/BrandMark";
import { PublicMobileNav } from "./PublicMobileNav";

function Chevron({ open = false }: { open?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" fill="none" className={`h-3 w-3 text-white/55 transition-transform duration-200 ${open ? "rotate-180" : ""}`} aria-hidden="true">
      <path d="m2.5 4.5 3.5 3 3.5-3" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MegaMenu({ item, onClose }: { item: NavItem; onClose: () => void }) {
  if (!item.children?.length) return null;

  const columns = item.children.length > 4 ? "grid-cols-2" : "grid-cols-1";

  return (
    <div className="border-t border-white/10 bg-[#073b5c] shadow-[0_18px_35px_rgba(3,28,45,0.14)]">
      <Container className="py-7">
        <div className={`grid ${columns} gap-x-12`}>
          {item.children.map((child) => (
            <Link
              key={child.href ?? child.label}
              href={child.href ?? "#"}
              onClick={onClose}
              className="group flex min-h-14 items-center justify-between border-b border-white/10 px-1 text-[15px] font-medium text-white/85 transition-colors duration-150 hover:text-[#f59e0b]"
            >
              <span>{child.label}</span>
              <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 -translate-x-1 text-white/40 opacity-70 transition-[opacity,transform] duration-150 group-hover:translate-x-0 group-hover:text-[#f59e0b] group-hover:opacity-100" aria-hidden="true">
                <path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}

export function PublicNavbar() {
  const pathname = usePathname();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);

  const activeItem = publicNav.find((item) => item.label === activeMenu);
  const activeMenuPath = activeMenu ? pathname : null;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveMenu(null);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const isMenuVisible = Boolean(activeItem && activeMenuPath === pathname);

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-white/10 bg-[#073b5c]">
      <Container className="flex h-18 items-center justify-between gap-8">
        <Link href="/" className="shrink-0" aria-label="PSI Surabaya - Beranda">
          <BrandMark variant="light" />
        </Link>

        <div className="ml-auto hidden items-center gap-8 lg:flex">
          <nav className="flex h-full items-center gap-7" aria-label="Navigasi utama">
            {publicNav.map((item) => {
              const hasChildren = Boolean(item.children?.length);
              const isOpen = activeMenu === item.label;
              const isActive = item.href === pathname || item.children?.some((child) => child.href === pathname);

              if (!hasChildren) {
                return (
                  <Link
                    key={item.href}
                    href={item.href ?? "#"}
                    className={`flex h-18 items-center whitespace-nowrap text-[14px] font-medium tracking-[0.005em] transition-colors duration-150 ${isActive ? "text-[#f59e0b]" : "text-white/85 hover:text-white"}`}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <button
                  key={item.label}
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setActiveMenu(isOpen ? null : item.label)}
                  className={`flex h-18 items-center gap-1.5 whitespace-nowrap text-[14px] font-medium tracking-[0.005em] transition-colors duration-150 ${isOpen || isActive ? "text-[#f59e0b]" : "text-white/85 hover:text-white"}`}
                >
                  {item.label}
                  <Chevron open={isOpen} />
                </button>
              );
            })}
          </nav>

          <Button href="/contact" size="small" variant="primary" className="h-10 rounded-[3px] px-5 text-[14px] font-medium">
            Hubungi Kami
          </Button>
        </div>

        <PublicMobileNav items={publicNav} />
      </Container>

      {isMenuVisible && (
        <div className="absolute inset-x-0 top-full hidden lg:block">
          <MegaMenu item={activeItem} onClose={() => setActiveMenu(null)} />
        </div>
      )}
    </header>
  );
}