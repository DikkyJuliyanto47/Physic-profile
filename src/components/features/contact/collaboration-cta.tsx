/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:32:18 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-09 18:32:18 
 */

import { Button, Container, Section } from "@/components/ui";
import { contactChannels } from "./data";

export function CollaborationCta() {
  const email = contactChannels.find((channel) => channel.id === "email");

  return (
    <Section padding="compact">
      <Container>
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-linear-to-br from-primary-900 to-primary-950 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
              <i className="fa-solid fa-handshake text-2xl" aria-hidden="true" />
            </span>
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-bold">Ingin Berkolaborasi?</h2>
              <p className="max-w-md text-white/80">
                PSI Surabaya terbuka terhadap kolaborasi dalam pendidikan,
                penelitian, dan kegiatan fisika.
              </p>
            </div>
          </div>

          {email?.href ? (
            <Button
              href={email.href}
              variant="light"
              icon={<i className="fa-regular fa-envelope" aria-hidden="true" />}
              className="shrink-0"
            >
              Kirim Email ke PSI Surabaya
            </Button>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}
