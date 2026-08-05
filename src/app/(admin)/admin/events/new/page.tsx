import { EventForm } from "@/components/admin/EventForm";

export const metadata = {
  title: "Tambah Agenda Baru - PSI Surabaya CMS",
};

export default function NewEventPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Tambah Agenda Baru</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Buat agenda atau event baru.
        </p>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-card">
        <EventForm mode="create" />
      </div>
    </div>
  );
}
