/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:56:18 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:54:02
 */

import { cn } from "@/utils";
import type { HTMLAttributes, ReactNode } from "react";

type SectionTone = "default" | "muted" | "dark";
type SectionPadding = "none" | "compact" | "normal" | "large";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  padding?: SectionPadding;
  children: ReactNode;
}

const toneClasses = {
  default: "bg-background text-foreground",
  muted: "bg-background-muted text-foreground",
  dark: "bg-primary-950 text-white",
};

const paddingClasses = {
  none: "",
  compact: "py-8 md:py-10",
  normal: "py-14 lg:py-18",
  large: "py-20 lg:py-28",
};

export function Section({
  tone = "default",
  padding = "normal",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        toneClasses[tone],
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
}