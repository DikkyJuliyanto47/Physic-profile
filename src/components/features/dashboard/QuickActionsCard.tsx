import { Button, Card } from "@/components/ui";

const quickActions = [
  { label: "Tambah Berita", href: "/admin/news/new" },
  { label: "Tambah Agenda", href: "/admin/agenda/baru" },
  { label: "Kelola Anggota", href: "/admin/members" },
  { label: "Kelola Publikasi", href: "/admin/publication" },
];

export function QuickActionsCard() {
  return (
    <Card>
      <h2 className="text-base font-semibold text-foreground">
        Quick Actions
      </h2>

      <div className="mt-4 flex flex-col gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.href}
            href={action.href}
            variant="outline"
            size="small"
            fullWidth
            className="justify-start"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </Card>
  );
}
