export type EventTimeStatus = "upcoming" | "ongoing" | "finished";

export const EVENT_STATUS_LABELS: Record<EventTimeStatus, string> = {
  upcoming: "Mendatang",
  ongoing: "Sedang Berlangsung",
  finished: "Selesai",
};

export function getEventTimeStatus(
  startDate: Date,
  endDate: Date | null,
  now: number,
): EventTimeStatus {
  if (now < startDate.getTime()) return "upcoming";
  if (now <= (endDate ?? startDate).getTime()) return "ongoing";
  return "finished";
}
