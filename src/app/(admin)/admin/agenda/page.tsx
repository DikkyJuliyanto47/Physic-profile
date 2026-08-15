import { Button } from "@/components/ui";
import { AdminAgendaTable } from "@/components/features/agenda/AdminAgendaTable";
import { adminAgendaList } from "@/components/features/agenda/admin-agenda-data";

export default function AdminAgendaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manajemen Agenda</h1>
          <p className="mt-1 text-sm text-foreground-muted">
            Kelola agenda kegiatan organisasi: buat, ubah, dan atur status publikasi.
          </p>
        </div>
        <Button href="/admin/agenda/baru" variant="primary" size="small">
          Tambah Agenda
        </Button>
      </div>

      <AdminAgendaTable initialItems={adminAgendaList} />
    </div>
  );
}