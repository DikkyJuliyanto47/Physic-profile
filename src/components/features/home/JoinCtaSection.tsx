import Link from "next/link";
import { Container, Section } from "@/components/ui/index";

export function JoinCtaSection() {
  return (
    <Section tone="dark" className="bg-linear-to-b from-primary-600 to-primary-950 text-center">
      <Container className="flex flex-col items-center gap-6">
        <h2 className="max-w-2xl text-2xl font-extrabold tracking-[-0.02em] text-white sm:text-3xl">
          Bergabung dengan Komunitas Fisika Surabaya
        </h2>

        <p className="max-w-2xl text-[15px] font-medium leading-7 text-white/85 sm:text-base">
          Bergabunglah untuk mendapatkan informasi kegiatan, kesempatan kolaborasi, dan update komunitas.
        </p>

        <Link
          href="/contact"
          className="inline-flex h-11 items-center justify-center rounded-full bg-white px-7 text-sm font-bold tracking-[0.01em] text-primary-700 transition-[background-color,color,transform] duration-200 hover:bg-primary-50 hover:text-primary-800 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-900"
        >
          Daftar sebagai Anggota
        </Link>
      </Container>
    </Section>
  );
}