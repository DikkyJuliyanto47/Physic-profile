import { Button, Container, Section } from "@/components/ui";
import { contactChannels } from "./data";

export function CollaborationCta() {
  const email = contactChannels.find((channel) => channel.id === "email");

  return (
    <Section padding="compact">
      <Container className="flex flex-col items-center gap-5 text-center">
        <h3 className="text-2xl font-bold text-foreground sm:text-3xl">
          Ingin berkolaborasi dengan kami?
        </h3>
        <p className="max-w-xl text-base leading-7 text-foreground-muted sm:text-lg">
          PSI Surabaya terbuka untuk kolaborasi di bidang pendidikan,
          penelitian, dan kegiatan fisika di Surabaya dan sekitarnya.
        </p>

        {email?.href ? (
          <Button
            href={email.href}
            size="large"
            icon={<i className="fa-regular fa-envelope" aria-hidden="true" />}
            iconPosition="right"
          >
            Kirim Email
          </Button>
        ) : null}
      </Container>
    </Section>
  );
}