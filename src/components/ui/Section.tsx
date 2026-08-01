/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:56:18 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 08:57:03
 */

import type { HTMLAttributes, ReactNode } from "react";

type SectionTone = "default" | "muted" | "dark";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  children: ReactNode;
}

const toneClasses: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-background-muted text-foreground",
  dark: "bg-primary-950 text-white",
};

export function Section({
  tone = "default",
  className = "",
  children,
  ...rest
}: SectionProps) {
  const classes = [
    "py-16 sm:py-20 lg:py-24",
    toneClasses[tone],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={classes} {...rest}>
      {children}
    </section>
  );
}
