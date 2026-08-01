/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 20:59:35 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-01 21:03:55
 */

interface BrandMarkProps {
    variant?: "light" | "dark";
}

export function BrandMark({ variant = "light" }: BrandMarkProps) {
    const titleColor = variant === "dark" ? "text-white" : "text-foreground";
    const subtitileColor = variant === "dark" ? "text-white/70" : "text-foreground-muted";

    return (
        <span className="flex items-center gap-2">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-primary-600 text-sm font-bold text-primari-600">
                &#934;
            </span>
            <span className="flex flex-col leading-tight">
                <span className={`text-[11px] font-medium ${subtitileColor}`}>
                    Physical Society of Indonesia
                </span>
                <span className={`text-sm font-bold ${titleColor}`}>
                    Fisika Surabaya
                </span>
            </span>
        </span>
    )
}