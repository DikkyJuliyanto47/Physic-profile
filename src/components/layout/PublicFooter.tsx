
import Link from "next/link";
import { Container } from "@/components/ui";
import { footerNav, siteConfig, socialLinks } from "@/config/site";
import type { NavItem } from "@/types";
import { BrandMark } from "./BrandMark";

const affiliationLines = [
  "Universitas Negeri Surabaya",
  "Physics Society Indonesia",
  "Fisika UNESA",
];

const columnHeadingClass =
  "text-sm font-bold uppercase tracking-wider text-white";

function FooterColumn({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="flex flex-col gap-4">
      <span className={columnHeadingClass}>{title}</span>
      <ul className="flex flex-col gap-3">
         {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link
              href={item.href}
              className="text-sm text-white/65 transition-colors hover:text-white"
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
      <Container className="grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] lg:gap-8 lg:py-20">
        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <BrandMark variant="dark" />
          <p className="max-w-sm text-sm text-white/65">
            {siteConfig.description}
          </p>
        </div>

        <FooterColumn title="Tentang" items={footerNav.about} />
        <FooterColumn title="Jelajahi" items={footerNav.jelajahi} />

        <div className="flex flex-col gap-4">
          <span className={columnHeadingClass}>Kontak</span>
          <ul className="flex flex-col gap-3 text-sm text-white/65">
            {affiliationLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col-reverse items-center gap-6 py-7 text-sm text-white/65 sm:flex-row sm:justify-between">
          <span>
            &copy; {year} {siteConfig.name}
          </span>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/90 transition-colors hover:border-white/40 hover:text-white sm:h-10 sm:w-10"
              >
                <i className={`${social.icon} text-base`} aria-hidden="true" />
              </a>
            ))}
          </div>
        </Container>
      </div>
    </footer>
  );
}