/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:56:18 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:54:02
 */

import type { HTMLAttributes, ReactNode } from "react";

type SectionTone = "default" | "muted" | "dark";
type SectionPadding = "compact" | "normal" | "large" | "none";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  padding?: SectionPadding;
  children: ReactNode;
}

const toneClasses: Record<SectionTone, string> = {
  default: "bg-background text-foreground",
  muted: "bg-background-muted text-foreground",
  dark: "bg-primary-950 text-white",
};

const paddingClasses: Record<SectionPadding, string> = {
  compact: "py-4 sm:py-6 md:py-8",
  normal: "py-12 sm:py-16 lg:py-20",
  large: "py-16 sm:py-20 lg:py-24",
  none: "py-0",
};

export function Section({
  tone = "default",
  className = "",
  padding = "large",
  children,
  ...rest
}: SectionProps) {
  const classes = [
    "py-16 sm:py-20 lg:py-24",
    toneClasses[tone],
    paddingClasses[padding],
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
