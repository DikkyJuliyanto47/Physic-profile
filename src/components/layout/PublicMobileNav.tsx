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
    <div className="relative lg:hidden">
      <button
        type="button"
        aria-label={isOpen ? "Tutup menu" : "Buka menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
        className="
          flex h-10 w-10
          items-center justify-center
          rounded-md
          border border-border
          bg-white
          text-foreground
          transition-[background-color,border-color,color]
          duration-200
          hover:border-primary-200
          hover:bg-primary-50
          hover:text-primary-600
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-primary-300
          focus-visible:ring-offset-2
        "
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
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
            strokeWidth="1.8"
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

      <div
        className={[
          "absolute inset-x-0 top-[calc(100%+1px)] z-40",
          "origin-top",
          "border-b border-border/70",
          "bg-white/95 backdrop-blur-xl",
          "shadow-[0_14px_30px_rgba(15,23,42,0.08)]",
          "transition-[opacity,transform,visibility]",
          "duration-200 ease-out",
          isOpen
            ? "visible translate-y-0 opacity-100"
            : "invisible -translate-y-2 opacity-0",
        ].join(" ")}
      >
        <nav className="mx-auto flex max-w-(--container-max) flex-col gap-1 px-4 py-4 sm:px-6">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="
                flex min-h-11
                items-center
                border-b border-border/50
                px-2
                text-sm font-semibold
                text-foreground
                transition-[color,background-color]
                duration-200
                hover:bg-primary-50
                hover:text-primary-600
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-primary-300
              "
            >
              {item.label}
            </Link>
          ))}

          <div className="pt-3">
            <Button
              href="/contact"
              size="small"
              fullWidth
              variant="primary"
              className="h-10 rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Hubungi Kami
            </Button>
          </div>
        </nav>
      </div>
    </div>
  );
}