/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:42:24 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 08:45:48
 */

import type { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    padded?: boolean;
}

export function Card({
    padded = true,
    className = "",
    children,
    ...rest
}: CardProps) {
    const classes = [
        "rounded-lg border border-border bg-background shadow-card",
        padded ? "p-5" : "",
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