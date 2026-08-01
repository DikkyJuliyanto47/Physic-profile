/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:51:29 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-01 08:51:29 
 */

import type { HTMLAttributes, ReactNode } from "react";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function Container({
  className = "",
  children,
  ...rest
}: ContainerProps) {
  const classes = [
    "mx-auto w-full max-w-[var(--container-max)] px-4 sm:px-6 lg:px-8",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}
