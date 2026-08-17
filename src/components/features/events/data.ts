import { prisma } from "@/lib/prisma";

export interface EventItem {
  id: string;
  title: string;
  date: string;
  description: string;
  location: string;
  image?: string;
  href: string;
}

function formatEventDate(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export async function getUpcomingEvents(limit = 3): Promise<EventItem[]> {
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      startDate: { gte: new Date() },
    },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      imageUrl: true,
      startDate: true,
    },
    orderBy: { startDate: "asc" },
    take: limit,
  });

  return events.map((event) => ({
    id: event.id,
    title: event.title,
    date: formatEventDate(event.startDate),
    description: event.description,
    location: event.location,
    image: event.imageUrl ?? undefined,
    href: `/agenda/${event.slug}`,
  }));
}
