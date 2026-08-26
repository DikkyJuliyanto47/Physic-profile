import { FaCalendarAlt, FaMapMarkerAlt } from "react-icons/fa";

interface EventMetaProps {
  time: string;
  location: string;
  className?: string;
}

export function EventMeta({
  time,
  location,
  className = "",
}: EventMetaProps) {
  return (
    <div className={`space-y-1.5 text-sm text-foreground-muted ${className}`}>
      <div className="flex items-start gap-2">
        <FaCalendarAlt
          className="mt-1 h-3 w-3 shrink-0"
          aria-hidden="true"
        />
        <span>{time}</span>
      </div>

      <div className="flex items-start gap-2">
        <FaMapMarkerAlt
          className="mt-1 h-3 w-3 shrink-0"
          aria-hidden="true"
        />
        <span>{location}</span>
      </div>
    </div>
  );
}