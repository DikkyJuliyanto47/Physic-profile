import { BreadcrumbJsonLd } from "@/components/seo/BreadcrumbJsonLd";
import { publicMetadata } from "@/config/seo";
import { getPublishedEvents } from "@/lib/data";
import { Suspense } from "react";
import { connection } from "next/server";
import { getEventTimeStatus } from "@/lib/event-status";
import { Container, PageBreadcrumb, Section } from "@/components/ui";
import { EventList, FeaturedEvent } from "@/components/features/events";

export const metadata = publicMetadata(
  "Agenda PSI Surabaya",
  "Jadwal dan informasi seminar, workshop, webinar, serta kegiatan PSI Cabang Surabaya.",
  "/events",
);

export default function EventsPage() {
  return (
    <Suspense fallback={null}>
      <EventsContent />
    </Suspense>
  );
}

async function EventsContent() {
  const events = await getPublishedEvents();
  await connection();
  const now = new Date().getTime();
  const ongoingEvent = events.find(
    (event) =>
      getEventTimeStatus(event.startDate, event.endDate, now) === "ongoing",
  );
  const upcomingEvent = events.reduce<(typeof events)[number] | undefined>(
    (nearest, event) => {
      if (
        getEventTimeStatus(event.startDate, event.endDate, now) !== "upcoming"
      )
        return nearest;
      return !nearest || event.startDate < nearest.startDate ? event : nearest;
    },
    undefined,
  );
  const featuredEvent = ongoingEvent ?? upcomingEvent ?? events[0];
  const archiveEvents = events.filter(
    (event) => event.id !== featuredEvent?.id,
  );

  return (
    <Section className="pt-10 lg:pt-12">
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", path: "/" },
          { name: "Agenda", path: "/events" },
        ]}
      />
      <Container>
        <div className="flex flex-col gap-8">
          <PageBreadcrumb
            items={[{ label: "Beranda", href: "/" }, { label: "Events" }]}
          />

          {featuredEvent && (
            <FeaturedEvent
              item={featuredEvent}
              status={getEventTimeStatus(
                featuredEvent.startDate,
                featuredEvent.endDate,
                now,
              )}
            />
          )}

          <section className="flex flex-col gap-5 pt-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-primary-950 sm:text-3xl">
                Semua Agenda
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-foreground-muted">
                Informasi kegiatan dan aktivitas PSI Cabang Surabaya.
              </p>
            </div>

            <EventList items={archiveEvents} />
          </section>
        </div>
      </Container>
    </Section>
  );
}
