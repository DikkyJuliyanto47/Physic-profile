/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:31:27 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-13 20:00:00
 */

import { Container, Section } from "@/components/ui";
import { contactChannels } from "./data";

export function ConnectSection() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-12">
        <div className="grid w-full max-w-3xl grid-cols-1 gap-10 sm:grid-cols-3">
          {contactChannels.map((channel) => (
            <div key={channel.id} className="flex flex-col items-center gap-2 text-center">
              <i
                className={`${channel.icon} text-2xl text-primary-600`}
                aria-hidden="true"
              />
              <span className="text-base font-semibold text-foreground">
                {channel.label}
              </span>
              <span className="text-sm text-foreground-muted">
                {channel.value}
              </span>

              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-1 text-sm font-semibold text-primary-600 hover:underline"
                >
                  {channel.actionLabel} &rarr;
                </a>
              ) : (
                <span className="mt-1 text-sm text-foreground-muted/70">
                  Segera tersedia
                </span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}