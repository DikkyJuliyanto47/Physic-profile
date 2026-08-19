import Link from "next/link";
import { Button, Container } from "@/components/ui";
import { publicNav } from "@/config/site";
import { BrandMark } from "@/components/layout/BrandMark";
import { PublicMobileNav } from "./PublicMobileNav";

export function PublicNavbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-primary-700 bg-primary-600">
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
                                className="whitespace-nowrap text-[15px] font-semibold tracking-[0.005em] text-neutral-0 transition-colors hover:text-neutral-0/80"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    <div className="hidden lg:block">
                        <Button
                            href="/contact"
                            size="small"
                            variant="white"
                            className="h-10 rounded-[4px] px-5 text-[14px] font-semibold text-primary-700!"
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