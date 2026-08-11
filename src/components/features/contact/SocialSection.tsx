/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:34:48 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-09 18:34:48 
 */

import { Container, Section } from "@/components/ui";
import { socialLinks } from "@/config/site";

export function SocialSection() {
  return (
    <Section padding="compact">
      <Container className="flex flex-col items-center gap-4 rounded-lg border border-border bg-background-muted px-6 py-6 sm:flex-row sm:justify-center sm:gap-8">
        <span className="text-base font-semibold text-foreground">
          Ikuti PSI Surabaya
        </span>
        <div className="hidden h-6 w-px bg-border sm:block" aria-hidden="true" />
        <div className="flex flex-wrap items-center justify-center gap-6">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="flex items-center gap-2 text-sm font-medium text-foreground-muted transition-colors hover:text-primary-600"
            >
              <i className={social.icon} aria-hidden="true" />
              {social.label}
            </a>
          ))}
        </div>
      </Container>
    </Section>
  );
}
