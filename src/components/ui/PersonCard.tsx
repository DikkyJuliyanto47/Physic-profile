
import Link from "next/link";

type PersonCardSize = "default" | "lg";

interface PersonCardProps {
  name: string;
  subtitle?: string;
  tag?: string;
  href?: string;
  size?: PersonCardSize;
}

const avatarSizeClasses: Record<PersonCardSize, string> = {
  default: "h-16 w-16",
  lg: "h-24 w-24",
};

export function PersonCard({
  name,
  subtitle,
  tag,
  href,
  size = "default",
}: PersonCardProps) {
  const cardClasses = [
    "flex flex-col items-center gap-3 rounded-lg border border-border bg-background p-5 text-center",
    href ? "transition-colors hover:border-primary-300" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <div className={cardClasses}>
      <span
        className={`shrink-0 rounded-full bg-neutral-200 ${avatarSizeClasses[size]}`}
      />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{name}</span>
        {subtitle ? (
          <span className="text-xs text-foreground-muted">{subtitle}</span>
        ) : null}
      </div>
      {tag ? (
        <span className="rounded-full bg-primary-600 px-3 py-1 text-xs font-semibold text-white">
          {tag}
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
