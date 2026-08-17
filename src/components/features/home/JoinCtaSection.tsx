
import { Button, Container, Section } from "@/components/ui/index";

export function JoinCtaSection() {
  return (
    <Section
      tone="dark"
      className="bg-linear-to-b from-primary-600 to-primary-950 text-center"
    >
      <Container className="flex flex-col items-center gap-6">
        <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">
          Bergabung dengan Komunitas Fisika Surabaya
        </h2>
        <p className="max-w-2xl text-white/80">
          Bergabunglah untuk mendapatkan informasi kegiatan, kesempatan kolaborasi, dan update komunitas.
        </p>
        <Button href="/contact" variant="white">
          Daftar sebagai Anggota
        </Button>
      </Container>
    </Section>
  );
}