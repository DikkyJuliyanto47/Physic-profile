import { prisma } from "@/lib/prisma";

export interface EventItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  time: string;
  description: string;
  location?: string | null;
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

function formatEventTime(date: Date): string {
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function mapEvent(event: {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  imageUrl: string | null;
  startDate: Date;
}): EventItem {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    date: formatEventDate(event.startDate),
    time: `${formatEventTime(event.startDate)} WIB`,
    description: event.description,
    location: event.location,
    image: event.imageUrl ?? undefined,
    href: `/events/${event.slug}`,
  };
}

export async function getUpcomingEvents(limit = 4): Promise<EventItem[]> {
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
    orderBy: {
      startDate: "asc",
    },
    take: limit,
  });

  return events.map(mapEvent);
}

export async function getPublishedEvents(): Promise<EventItem[]> {
  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
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
    orderBy: {
      startDate: "desc",
    },
  });

  return events.map(mapEvent);
}