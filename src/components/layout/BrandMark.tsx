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
  const isDarkVariant = variant === "dark";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className="relative h-11 w-11 shrink-0">
        <Image
          src={logoSrc}
          alt="Physical Society of Indonesia"
          fill
          sizes="44px"
          className="object-contain"
          priority
        />
      </div>

      {showText && (
        <span className="flex min-w-0 flex-col leading-tight">
          <span
            className={`whitespace-nowrap text-[9px] font-medium tracking-[0.01em] ${
              isDarkVariant ? "text-neutral-500" : "text-neutral-0/70"
            }`}
          >
            Physical Society of Indonesia
          </span>

          <span
            className={`whitespace-nowrap text-[13px] font-bold tracking-tight ${
              isDarkVariant ? "text-primary-950" : "text-neutral-0"
            }`}
          >
            Cabang Surabaya
          </span>
        </span>
      )}
    </div>
  );
}