interface EventDateProps {
  date: string;
  className?: string;
}

export function EventDate({ date, className = "" }: EventDateProps) {
  const [day, month, year] = date.split(" ");

  return (
    <div className={`w-20 shrink-0 pt-1 text-center ${className}`}>
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600">
        {month}
      </div>

      <div className="mt-1 text-4xl font-semibold leading-none tracking-tight tabular-nums text-primary-950 sm:text-5xl">
        {day}
      </div>

      <div className="mt-2 text-xs font-medium text-foreground-muted">
        {year}
      </div>
    </div>
  );
}