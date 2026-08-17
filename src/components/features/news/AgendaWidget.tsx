
import Link from "next/link";
import { SidebarSection } from "./SidebarSection";

interface AgendaWidgetProps {
  href?: string;
}

export function AgendaWidget({ href = "/agenda" }: AgendaWidgetProps) {
  return (
    <SidebarSection title="Agenda">
      <Link
        href={href}
        className="inline-flex w-full items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
      >
        Lihat Agenda Selengkapnya →
      </Link>
    </SidebarSection>
  );
}
