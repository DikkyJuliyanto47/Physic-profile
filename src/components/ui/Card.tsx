import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padded?: boolean;
}

export function Card({ padded = true, className = "", children, ...rest }: CardProps) {
  const classes = [
    "border border-neutral-200 bg-background",
    padded ? "p-5" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}