import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { EventCategory, ContentStatus } from "@/generated/prisma/client";
import { EventActions } from "./EventActions";

export const dynamic = "force-dynamic";

const CATEGORY_LABELS: Record<EventCategory, string> = {
  SEMINAR_NASIONAL: "Seminar Nasional",
  KULIAH_TAMU: "Kuliah Tamu",
  WEBINAR: "Webinar",
  WORKSHOP: "Workshop",
  MUSYAWARAH_ANGGOTA: "Musyawarah Anggota",
};

const CATEGORY_COLORS: Record<EventCategory, string> = {
  SEMINAR_NASIONAL: "bg-blue-50 text-blue-700",
  KULIAH_TAMU: "bg-purple-50 text-purple-700",
  WEBINAR: "bg-cyan-50 text-cyan-700",
  WORKSHOP: "bg-orange-50 text-orange-700",
  MUSYAWARAH_ANGGOTA: "bg-teal-50 text-teal-700",
};

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

function formatDateTimeRange(start: Date, end: Date | null): string {
  const startStr = formatDate(start);
  const startTime = formatTime(start);

  if (!end) {
    return `${startStr}, ${startTime}`;
  }

  const endDate = new Date(end);
  const isSameDay = formatDate(start) === formatDate(endDate);

  if (isSameDay) {
    return `${startStr}, ${startTime} - ${formatTime(end)}`;
  }

  return `${startStr} ${startTime} - ${formatDate(end)} ${formatTime(end)}`;
}

export default async function EventsListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;

  const where: Record<string, unknown> = {};

  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { location: { contains: q, mode: "insensitive" } },
    ];
  }

  if (status && ["DRAFT", "PUBLISHED", "ARCHIVED"].includes(status)) {
    where.status = status as ContentStatus;
  }

  const events = await prisma.event.findMany({
    where,
    orderBy: { startDate: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Agenda & Event</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Kelola agenda dan event PSI Surabaya.
          </p>
        </div>
        <Link
          href="/admin/events/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tambah Agenda Baru
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Cari judul atau lokasi..."
            className="w-full rounded-lg border border-neutral-300 py-2.5 pl-10 pr-4 text-sm text-neutral-900 placeholder-neutral-400 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? ""}
          className="rounded-lg border border-neutral-300 px-4 py-2.5 text-sm text-neutral-900 transition-colors focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
        >
          <option value="">Semua Status</option>
          <option value="DRAFT">Draf</option>
          <option value="PUBLISHED">Terbit</option>
        </select>
        <button
          type="submit"
          className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="rounded-xl border border-neutral-200 bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50">
                <th className="px-5 py-3 font-medium text-neutral-600">Event</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Tanggal</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Lokasi</th>
                <th className="px-5 py-3 font-medium text-neutral-600">Status</th>
                <th className="px-5 py-3 text-right font-medium text-neutral-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-neutral-500">
                    {q || status
                      ? "Tidak ada event yang cocok dengan filter."
                      : "Belum ada event."}
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/50"
                  >
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-medium text-neutral-900 line-clamp-1">
                          {event.title}
                        </p>
                        <span
                          className={`mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[event.category]}`}
                        >
                          {CATEGORY_LABELS[event.category]}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-neutral-600">
                      <p className="text-sm">
                        {formatDateTimeRange(event.startDate, event.endDate)}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm text-neutral-600 line-clamp-1">
                        {event.location}
                      </p>
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          event.status === "PUBLISHED"
                            ? "bg-green-50 text-green-700"
                            : event.status === "DRAFT"
                              ? "bg-yellow-50 text-yellow-700"
                              : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {event.status === "PUBLISHED"
                          ? "Terbit"
                          : event.status === "DRAFT"
                            ? "Draf"
                            : "Arsip"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <EventActions
                        eventId={event.id}
                        eventTitle={event.title}
                        currentStatus={event.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
