/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:18:12 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-08 08:30:55
 */

import { Button, Container, Section } from "@/components/ui/index";

export function JoinCtaSection() {
  return (
    <Section
      tone="dark"
      className="bg-linear-to-br from-primary-900 to-primary-950 text-center"
    >
      <Container className="flex flex-col items-center gap-6">
        <h2 className="max-w-2xl text-2xl font-bold text-white sm:text-3xl">
          Bergabung dengan Komunitas Fisika Surabaya
        </h2>
        <p className="max-w-2xl text-white/70">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
          imperdiet, nulla et dictum interdum, nisi lorem egestas odio, vitae
          scelerisque enim ligula venenatis dolor.
        </p>
        <Button href="/kontak" variant="white">
          Daftar sebagai Anggota
        </Button>
      </Container>
    </Section>
  );
}
