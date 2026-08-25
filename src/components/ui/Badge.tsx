import type { HTMLAttributes, ReactNode } from "react";

type BadgeTone = "primary" | "neutral" | "dark";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  tone?: BadgeTone;
  children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  primary: "border-primary-200 bg-primary-50 text-primary-700",
  neutral: "border-neutral-200 bg-neutral-50 text-neutral-700",
  dark: "border-primary-800 bg-primary-900 text-white",
};

export function Badge({ tone = "primary", className = "", children, ...rest }: BadgeProps) {
  const classes = [
    "inline-flex items-center border px-2 py-1 text-xs font-semibold uppercase tracking-wide",
    toneClasses[tone],
    className,
  ].filter(Boolean).join(" ");

  return (
    <span className={classes} {...rest}>
      {children}
    </span>
  );
}