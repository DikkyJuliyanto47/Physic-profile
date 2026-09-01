import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EventMetaProps {
  time: string;
  location?: string | null;
  className?: string;
}

export function EventMeta({
  time,
  location,
  className = "",
}: EventMetaProps) {
  return (
    <div
      className={`flex flex-col gap-1.5 text-sm text-foreground-muted sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 ${className}`}
    >
      <span className="inline-flex items-center gap-2">
        <FaCalendarAlt
          className="h-3 w-3 shrink-0 text-primary-600"
          aria-hidden="true"
        />
        {time}
      </span>

      {location && (
        <>
          <span className="hidden h-3.5 w-px bg-border sm:block" aria-hidden="true" />

          <span className="inline-flex items-start gap-2">
            <FaMapMarkerAlt
              className="mt-0.5 h-3 w-3 shrink-0 text-primary-600"
              aria-hidden="true"
            />
            <span>{location}</span>
          </span>
        </>
      )}
    </div>
  );
}