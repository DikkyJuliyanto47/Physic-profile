
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
        className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-900 hover:bg-gray-100"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M18 6L6 18" />
            <path d="M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
            aria-hidden="true"
          >
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        )}
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
              href="/contact"
              size="small"
              fullWidth
              variant="primary"
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
