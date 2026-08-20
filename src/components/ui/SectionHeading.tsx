
import type { ReactNode } from "react";

type SectionHeadingAlign = "left" | "center";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: SectionHeadingAlign;
  action?: ReactNode;
  className?: string;
  size?: "default" | "large";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className = "",
  size = "default",
}: SectionHeadingProps) {
  const alignClasses =
    align === "center" ? "text-center items-center" : "text-left items-start";

  const titleSizeClasses = 
    size === "large" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl";

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
        <h2 className={`${titleSizeClasses} font-bold text-foreground`}>
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
