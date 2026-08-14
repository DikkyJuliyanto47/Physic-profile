import { Card } from "@/components/ui";

import type { StatusSummaryRow } from "./dummy-data";

interface StatusSummaryCardProps {
  rows: StatusSummaryRow[];
}

export function StatusSummaryCard({ rows }: StatusSummaryCardProps) {
  const totalNews = rows.reduce((sum, row) => sum + row.news, 0);
  const totalEvent = rows.reduce((sum, row) => sum + row.event, 0);

  return (
    <Card padded={false}>
      <div className="border-b border-border px-5 py-4">
        <h2 className="text-base font-semibold text-foreground">
          Status Konten
        </h2>
        <p className="mt-1 text-sm text-foreground-muted">
          Berita dan Agenda adalah satu-satunya konten dengan status
          Draft/Published/Archived pada schema saat ini.
        </p>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-foreground-muted">
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Berita</th>
            <th className="px-5 py-3 font-medium">Agenda</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.status} className="border-b border-border last:border-b-0">
              <td className="px-5 py-3 text-foreground">{row.label}</td>
              <td className="px-5 py-3 text-foreground">{row.news}</td>
              <td className="px-5 py-3 text-foreground">{row.event}</td>
            </tr>
          ))}
          <tr>
            <td className="px-5 py-3 font-semibold text-foreground">Total</td>
            <td className="px-5 py-3 font-semibold text-foreground">
              {totalNews}
            </td>
            <td className="px-5 py-3 font-semibold text-foreground">
              {totalEvent}
            </td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
}