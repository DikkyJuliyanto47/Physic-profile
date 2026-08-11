/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 19:56:42 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 21:06:34
 */

import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { publicNav } from "@/config/site";
import { BrandMark } from "@/components/layout/BrandMark";
import { PublicMobileNav } from "./public-mobile-nav";

export function PublicNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-border bg-background">
            <Container className="flex h-16 items-center justify-between gap-4 sm:h-20">
                <Link href="/" className="shrink-0">
                    <BrandMark />
                </Link>

                <div className="ml-auto flex items-center gap-6">
                    <nav className="hidden items-center gap-6 lg:flex">
                        {publicNav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-sm font-medium text-foreground-muted transition-colors hover:text-primary-600"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:block">
                        <Button href="/kontak" size="small">
                            Hubungi Kami
                        </Button>
                    </div>
                </div>

                <PublicMobileNav items={publicNav} />
            </Container>
        </header>
    );
}
