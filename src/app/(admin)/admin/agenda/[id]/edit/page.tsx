import { notFound } from "next/navigation";

import { AgendaForm, type AgendaFormValues } from "@/components/forms/AgendaForm";
import { adminAgendaList } from "@/components/features/agenda/admin-agenda-data";

interface EditAgendaPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAgendaPage({ params }: EditAgendaPageProps) {
  const { id } = await params;
  const agenda = adminAgendaList.find((item) => item.id === id);

  if (!agenda) {
    notFound();
  }

  const initialValues: Partial<AgendaFormValues> = {
    title: agenda.title,
    slug: agenda.slug,
    category: agenda.category,
    description: agenda.description,
    startDate: agenda.startDate,
    endDate: agenda.endDate ?? "",
    location: agenda.location,
    linkUrl: agenda.linkUrl ?? "",
    imageUrl: agenda.imageUrl,
    status: agenda.status,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Agenda</h1>
        <p className="mt-1 text-sm text-foreground-muted">{agenda.title}</p>
      </div>

      <AgendaForm mode="edit" agendaId={agenda.id} initialValues={initialValues} />
    </div>
  );
}