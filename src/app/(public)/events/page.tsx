import {
  Container,
  PageBreadcrumb,
  Section,
} from "@/components/ui";
import {
  EventList,
  FeaturedEvent,
} from "@/components/features/events";
import type { EventItem } from "@/components/features/events";

const dummyEvents: EventItem[] = [
  {
    id: "event-1",
    slug: "penyelarasan-kurikulum-asesmen-obe",
    title: "Penyelarasan Kurikulum: Asesmen OBE",
    date: "29 Juli 2026",
    time: "09.30 - 12.30 WIB",
    location:
      "Ruang Meeting Rumpun Fisika, Gedung C3 Lantai 1, Universitas Negeri Surabaya",
    description:
      "Pertemuan anggota dan akademisi untuk membahas pengembangan serta penyelarasan kegiatan keilmuan fisika.",
    image: "/assets/activity/penyelarasan-kurikulum.jpeg",
    href: "/events/penyelarasan-kurikulum-asesmen-obe",
  },
  {
    id: "event-2",
    slug: "diskusi-pengembangan-komunitas-fisika",
    title: "Diskusi dan Pengembangan Komunitas Fisika",
    date: "8 Agustus 2026",
    time: "10.00 - 12.00 WIB",
    location:
      "Ruang Seminar Departemen Fisika, Universitas Negeri Surabaya",
    description:
      "Forum diskusi untuk memperkuat komunikasi, kolaborasi akademik, dan pengembangan komunitas fisika.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/events/diskusi-pengembangan-komunitas-fisika",
  },
  {
    id: "event-3",
    slug: "pertemuan-anggota-psi-cabang-surabaya",
    title: "Pertemuan Anggota PSI Cabang Surabaya",
    date: "22 Agustus 2026",
    time: "09.00 - 11.30 WIB",
    location: "Surabaya",
    description:
      "Pertemuan anggota sebagai ruang koordinasi dan pertukaran informasi kegiatan PSI Cabang Surabaya.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/events/pertemuan-anggota-psi-cabang-surabaya",
  },
  {
    id: "event-4",
    slug: "forum-kolaborasi-fisika-surabaya",
    title: "Forum Kolaborasi Fisika Surabaya",
    date: "5 September 2026",
    time: "09.00 - 12.00 WIB",
    location: "Surabaya",
    description:
      "Forum kolaborasi antara akademisi, peneliti, pendidik, mahasiswa, dan anggota komunitas fisika.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/events/forum-kolaborasi-fisika-surabaya",
  },
  {
    id: "event-5",
    slug: "seminar-fisika-dan-pendidikan",
    title: "Seminar Fisika dan Pendidikan",
    date: "19 September 2026",
    time: "08.30 - 13.00 WIB",
    location: "Gedung Auditorium Universitas Negeri Surabaya",
    description:
      "Seminar yang mempertemukan akademisi, pendidik, mahasiswa, dan praktisi untuk membahas perkembangan fisika dan pendidikan.",
    image: "/assets/activity/pertemuan-07-27-01.jpeg",
    href: "/events/seminar-fisika-dan-pendidikan",
  },
];

export default function EventsPage() {
  const [featuredEvent, ...archiveEvents] = dummyEvents;

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