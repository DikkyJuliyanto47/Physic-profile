import { AgendaForm } from "@/components/features/admin/forms/AgendaForm";

export default function CreateAgendaPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Tambah Agenda</h1>
        <p className="mt-1 text-sm text-foreground-muted">
          Buat agenda kegiatan baru untuk ditampilkan di halaman publik.
        </p>
      </div>

      <AgendaForm mode="create" />
    </div>
  );
}