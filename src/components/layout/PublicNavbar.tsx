"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Button, Container } from "@/components/ui";
import { publicNav } from "@/config/site";
import { BrandMark } from "@/components/layout/BrandMark";
import { PublicMobileNav } from "./PublicMobileNav";

export function PublicNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 8);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return (
        <header
            className={[
                "sticky top-0 z-50",
                "border-b",
                "transition-[background-color,box-shadow,border-color,backdrop-filter]",
                "duration-300 ease-out",
                isScrolled
                    ? "border-border/70 bg-white/85 shadow-[0_4px_20px_rgba(15,23,42,0.05)] backdrop-blur-xl"
                    : "border-border/60 bg-white",
            ].join(" ")}
        >
            <Container className="flex h-19 items-center justify-between gap-6">
                <Link
                    href="/"
                    className="shrink-0"
                    aria-label="PSI Surabaya - Beranda"
                >
                    <BrandMark variant="dark" />
                </Link>

                <div className="ml-auto flex items-center gap-8">
                    <nav className="hidden items-center gap-8 lg:flex">
                        {publicNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="
                                    whitespace-nowrap
                                    text-[15px]
                                    font-semibold
                                    tracking-[0.005em]
                                    text-foreground
                                    transition-colors
                                    hover:text-primary-600
                                "
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:block">
                        <Button
                            href="/contact"
                            size="small"
                            variant="primary"
                            className="h-10 rounded-[4px] px-5 text-[14px] font-semibold"
                        >
                            Hubungi Kami
                        </Button>
                    </div>
                </div>

                <PublicMobileNav items={publicNav} />
            </Container>
        </header>
    );
}