import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { EventForm } from "@/components/admin/EventForm";

export const metadata = {
  title: "Edit Agenda - PSI Cabang Surabaya",
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
          Edit Event
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Perbarui &ldquo;{event.title}&rdquo;.
        </p>
      </div>

      <div className="rounded-lg border border-neutral-200 bg-white p-5 sm:p-6">
        <EventForm mode="edit" initialData={event} />
      </div>
    </div>
  );
}