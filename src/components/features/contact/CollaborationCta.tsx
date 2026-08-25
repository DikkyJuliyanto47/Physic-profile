import { Button, Container, Section } from "@/components/ui";

import { contactChannels } from "./data";

export function CollaborationCta() {
  const email = contactChannels.find((channel) => channel.id === "email");

  return (
    <Section padding="compact">
      <Container>
        <div className="border-y border-border py-12 text-center sm:py-14 lg:py-16">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary-700">
            Kolaborasi
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Ingin berkolaborasi dengan kami?
          </h3>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-foreground-muted sm:text-lg sm:leading-8">
            PSI Surabaya terbuka untuk kolaborasi di bidang pendidikan,
            penelitian, dan kegiatan fisika di Surabaya dan sekitarnya.
          </p>

          {email?.href ? (
            <div className="mt-7">
              <Button
                href={email.href}
                size="large"
                icon={<i className="fa-regular fa-envelope" aria-hidden="true" />}
                iconPosition="right"
              >
                Kirim Email
              </Button>
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}