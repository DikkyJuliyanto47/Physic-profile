import { getPublishedEvents } from "@/lib/data";
import {
  Container,
  PageBreadcrumb,
  Section,
} from "@/components/ui";
import {
  EventList,
  FeaturedEvent,
} from "@/components/features/events";

export default async function EventsPage() {
  const events = await getPublishedEvents();
  const [featuredEvent, ...archiveEvents] = events;

  return (
    <Section className="pt-10 lg:pt-12">
      <Container>
        <div className="flex flex-col gap-8">
          <PageBreadcrumb
            items={[
              { label: "Beranda", href: "/" },
              { label: "Events" },
            ]}
          />

          {featuredEvent && <FeaturedEvent item={featuredEvent} />}

          <section className="flex flex-col gap-5 pt-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-primary-950 sm:text-3xl">
                Semua Agenda
              </h2>

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
