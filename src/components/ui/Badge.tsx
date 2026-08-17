
import type { HTMLAttributes, ReactNode } from 'react';

type BadgeTone = "primary" | "neutral" | "dark";

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
    tone?: BadgeTone;
    children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
    primary: "bg-primary-500 text-primary-700",
    neutral: "bg-neutral-500 text-neutral-700",
    dark: "bg-primary-500 text-white-700",
};

export function Badge({
    tone= "primary",
    className = "",
    children,
    ...rest
}: BadgeProps) {
    const classes = [
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        toneClasses[tone],
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <span className={classes} {...rest}>
            {children}
        </span>
    )
}