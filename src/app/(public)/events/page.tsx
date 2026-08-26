import Link from "next/link";

import { Container, Section } from "@/components/ui";
import { EventCard } from "@/components/features/events/EventCard";
import { getPublishedEvents } from "@/components/features/events/data";

export default async function EventsPage() {
  const events = await getPublishedEvents();

  return (
    <main>
      <Section padding="large">
        <Container>
          <div className="max-w-3xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-600">
              Agenda
            </span>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-primary-900 sm:text-4xl lg:text-5xl">
              Kegiatan PSI Cabang Surabaya
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg">
              Informasi kegiatan, forum, seminar, dan berbagai aktivitas
              keilmuan PSI Cabang Surabaya.
            </p>
          </div>
        </Container>
      </Section>

      <Section padding="normal">
        <Container>
          <div className="flex items-end justify-between border-b border-border pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-primary-600">
                Agenda
              </span>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-primary-900">
                Semua Kegiatan
              </h2>
            </div>

            <Link
              href="/"
              className="hidden text-sm font-medium text-foreground-muted transition-colors hover:text-primary-600 sm:inline-flex"
            >
              Kembali ke Beranda →
            </Link>
          </div>

          <div className="mt-8 max-w-4xl">
            {events.length > 0 ? (
              events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              <div className="border-y border-border py-16 text-center">
                <p className="text-sm text-foreground-muted">
                  Belum ada agenda yang tersedia.
                </p>
              </div>
            )}
          </div>
        </Container>
      </Section>
    </main>
  );
}