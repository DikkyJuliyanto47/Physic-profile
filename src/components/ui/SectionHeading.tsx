/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:58:35 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-01 08:58:35 
 */

import type { ReactNode } from "react";

type SectionHeadingAlign = "left" | "center";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: SectionHeadingAlign;
  action?: ReactNode;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className = "",
}: SectionHeadingProps) {
  const alignClasses =
    align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div
      className={[
        "flex w-full flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className={["flex flex-col gap-2", alignClasses].join(" ")}>
        {eyebrow ? (
          <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
            {eyebrow}
          </span>
        ) : null}
        <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
          {title}
        </h2>
        {description ? (
          <p className="max-w-2xl text-foreground-muted">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
