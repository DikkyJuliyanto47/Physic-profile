interface EventDateProps {
  date: string;
  className?: string;
}

export function EventDate({ date, className = "" }: EventDateProps) {
  const [day, month, year] = date.split(" ");

  return (
    <div className={`w-18 shrink-0 text-center ${className}`}>
      <div className="border border-border bg-background">
        <div className="border-b border-border px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-600">
          {month}
        </div>

        <div className="px-2 py-2 text-3xl font-bold leading-none tabular-nums text-primary-950">
          {day}
        </div>

        <div className="px-2 pb-2 text-[10px] text-foreground-muted">
          {year}
        </div>
      </div>
    </div>
  );
}