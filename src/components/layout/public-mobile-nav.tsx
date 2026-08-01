/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 21:20:55 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 21:32:27
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/types";
import { Button } from "@/components/ui";

interface PublicMobileNavProps {
  items: NavItem[];
}

export function PublicMobileNav({ items }: PublicMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-10 w-10 items-center justify-center rounded-md border border-border text-foreground"
      >
        <i
          className={isOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}
          aria-hidden="true"
        />
      </button>

      {isOpen ? (
        <div className="absolute inset-x-0 top-16 z-40 border-b border-border bg-background shadow-elevated sm:top-20">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="rounded-md px-3 py-2 text-sm font-medium text-foreground-muted hover:bg-background-muted hover:text-primary-600"
              >
                {item.label}
              </Link>
            ))}
            <Button
              href="/kontak"
              size="small"
              fullWidth
              onClick={() => setIsOpen(false)}
            >
              Hubungi Kami
            </Button>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
