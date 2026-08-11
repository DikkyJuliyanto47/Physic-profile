/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 18:31:27 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-09 18:31:51
 */

import { Button, Card, Container, Section } from "@/components/ui";
import { contactChannels } from "./data";

export function ConnectSection() {
  return (
    <Section>
      <Container className="flex flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            Mari Terhubung
          </h2>
          <span className="h-1 w-10 rounded-full bg-primary-600" aria-hidden="true" />
        </div>

        <div className="grid w-full gap-6 sm:grid-cols-3">
          {contactChannels.map((channel) => (
            <Card
              key={channel.id}
              className="flex flex-col items-center gap-4 text-center"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <i className={channel.icon} aria-hidden="true" />
              </span>

              <div className="flex flex-col gap-1">
                <span className="text-base font-semibold text-foreground">
                  {channel.label}
                </span>
                <span className="text-sm text-foreground-muted">
                  {channel.value}
                </span>
              </div>

              <div className="w-full border-t border-border pt-4">
                {channel.href ? (
                  <Button
                    href={channel.href}
                    variant="outline"
                    size="small"
                    fullWidth
                    icon={<i className={channel.icon} aria-hidden="true" />}
                  >
                    {channel.actionLabel}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="small"
                    fullWidth
                    disabled
                    icon={<i className={channel.icon} aria-hidden="true" />}
                  >
                    {channel.actionLabel}
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}
