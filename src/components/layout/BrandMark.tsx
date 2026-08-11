/*
 * @Author: galhkoernia 
 * @Date: 2026-08-01 20:59:35 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 10:45:00
 */

import Image from "next/image";

interface BrandMarkProps {
  variant?: "light" | "dark";
  className?: string;
  showText?: boolean; 
}

export function BrandMark({ 
  variant = "light", 
  className = "",
  showText = true 
}: BrandMarkProps) {
  // Logo berdasarkan variant
  const logoSrc = variant === "dark" 
    ? "/assets/logo/navbar/psi-indonesia.png" 
    : "/assets/logo/navbar/psi-indonesia.png";     

  // Warna teks berdasarkan variant
  const titleColor = variant === "dark" ? "text-white" : "text-foreground";
  const subtitleColor = variant === "dark" ? "text-white/70" : "text-foreground-muted";

  return (
    <div  className={`flex items-center gap-3 ${className}`}>

      <div className="relative h-10 w-10 shrink-0">
        <Image
          src={logoSrc}
          alt="Physics Profile Logo"
          fill
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <span className="flex flex-col leading-tight">
          <span className={`text-[11px] font-medium ${subtitleColor}`}>
            Physical Society of Indonesia
          </span>
          <span className={`text-sm font-bold ${titleColor}`}>
            Fisika Surabaya
          </span>
        </span>
      )}
    </div>
  );
}