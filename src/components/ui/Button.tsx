/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 08:10:06 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 08:36:09
 */

import Link from "next/link";

import {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "small" | "medium" | "large";

interface ButtonBaseProps {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
    fullWidth?: boolean;
    className?: string;
    children: ReactNode;
}

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
};

type ButtonAsLink = ButtonBaseProps & AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-colors " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 " +
  "disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700",
  secondary: "bg-primary-950 text-white hover:bg-primary-900",
  outline: "border border-border text-foreground hover:bg-background-muted",
  ghost: "text-primary-600 hover:bg-primary-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  small: "h-9 px-3 text-sm",
  medium: "h-11 px-5 text-sm",
  large: "h-12 px-6 text-base",
};

function buildClassName(
    variant: ButtonVariant,
    size: ButtonSize,
    fullWidth: boolean,
    className?: string,
): string {
    return [
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className || "",
    ]
        .filter(Boolean)
        .join(" ");
}

function isLinkButton(props: ButtonProps): props is ButtonAsLink {
    // Pastikan ini return boolean, bukan void
    return (props as ButtonAsLink).href !== undefined;
    // ATAU lebih aman:
    // return 'href' in props && props.href !== undefined;
}

export function Button(props: ButtonProps) {
    const {
        variant = "primary",
        size = "medium",
        icon, 
        iconPosition = "left",
        fullWidth = false,
        className = "",
        children,
        ...rest

    } = props as ButtonBaseProps & { href?: string };

    const classes = buildClassName(variant, size, fullWidth, className);

    const content = (
        <>
            {icon && iconPosition === "left" ? icon : null}
            {children}
            {icon && iconPosition === "right" ? icon : null}
        </>
    );

    if (isLinkButton(props)) {
        const { href, ...linkRest } = rest;
        return (
            <Link
                href={href}
                className={classes}
                {...linkRest}
            >
                {content}
            </Link>
        );
    }

    return (
        <button
            className={classes}
            {...rest}
        >
            {content}
        </button>
    );
}

