import { Container, Section } from "@/components/ui";

import { contactChannels } from "./data";

export function ConnectSection() {
  return (
    <Section padding="compact">
      <Container>
        <div className="grid w-full border-y border-border sm:grid-cols-3">
          {contactChannels.map((channel, index) => (
            <div
              key={channel.id}
              className={`flex min-h-40 flex-col justify-center px-6 py-8 text-center sm:px-8 ${
                index > 0 ? "border-t border-border sm:border-l sm:border-t-0" : ""
              }`}
            >
              <i
                className={`${channel.icon} text-xl text-primary-700`}
                aria-hidden="true"
              />

              <span className="mt-4 text-base font-semibold text-foreground">
                {channel.label}
              </span>

              <span className="mt-1 text-sm leading-6 text-foreground-muted">
                {channel.value}
              </span>

              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-3 text-sm font-medium text-primary-700 transition-colors hover:text-primary-800"
                >
                  {channel.actionLabel}
                  <span className="ml-1.5" aria-hidden="true">
                    →
                  </span>
                </a>
              ) : (
                <span className="mt-3 text-sm text-foreground-muted/70">
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