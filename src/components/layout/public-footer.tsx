/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 21:33:19 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-01 21:33:19 
 */

import Link from "next/link";
import { Container } from "@/components/ui";
import { footerNav, siteConfig, socialLinks } from "@/config/site";
import type { NavItem } from "@/types";
import { BrandMark } from "./brand-mark";

const affiliationLines = [
  "Universitas Negeri Surabaya",
  "Physics Society Indonesia",
  "Fisika UNESA",
];

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-semibold uppercase tracking-wide text-white">
        {title}
      </span>
      <ul className="flex flex-col gap-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-white/70 transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PublicFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-primary-950 text-white">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex flex-col gap-3">
          <BrandMark variant="dark" />
          <p className="text-sm text-white/70">{siteConfig.description}</p>
        </div>

        <FooterColumn title="Tentang" items={footerNav.tentang} />
        <FooterColumn title="Jelajahi" items={footerNav.jelajahi} />

        <div className="flex flex-col gap-3">
          <span className="text-sm font-semibold uppercase tracking-wide text-white">
            Kontak
          </span>
          <ul className="flex flex-col gap-2 text-sm text-white/70">
            {affiliationLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col-reverse items-center gap-4 py-6 text-sm text-white/70 sm:flex-row sm:justify-between">
          <span>
            &copy; {year} {siteConfig.name}
          </span>
          <div className="flex items-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="text-white/70 transition-colors hover:text-white"
              >
                <i className={social.icon} aria-hidden="true" />
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}
