import Image from "next/image";

interface BrandMarkProps {
    variant?: "light" | "dark";
    className?: string;
    showText?: boolean;
}

export function BrandMark({
    variant = "light",
    className = "",
    showText = true,
}: BrandMarkProps) {
    const logoSrc = "/assets/logo/navbar/psi-indonesia.png";

    const titleColor =
        variant === "dark"
            ? "text-neutral-0"
            : "text-foreground";

    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative h-14 w-14 shrink-0">
                <Image
                    src={logoSrc}
                    alt="Physical Society of Indonesia"
                    fill
                    sizes="56px"
                    className="object-contain"
                    priority
                />
            </div>

            {showText && (
                <span className="flex flex-col leading-tight">
                    <span
                        className={`text-[11px] font-medium tracking-[0.01em] ${
                            variant === "dark"
                                ? "text-neutral-0/80"
                                : "text-foreground-muted"
                        }`}
                    >
                        Physical Society of Indonesia
                    </span>

                    <span
                        className={`text-sm font-bold tracking-[0.005em] ${titleColor}`}
                    >
                        Cabang Surabaya
                    </span>
                </span>
            )}
        </div>
    );
}