import { Mail, MapPin, Phone } from "lucide-react";
import { Container, Section } from "@/components/ui";
import { contactChannels } from "./data";
import { CollaborationCta } from "./CollaborationCta";
import { LocationSection } from "./LocationSection";

const contactLinkClassName =
  "inline-block rounded-sm wrap-anywhere text-base font-medium leading-6 text-primary-700 transition-colors duration-150 hover:text-primary-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-700 motion-reduce:transition-none";

export function ConnectSection() {
  const email = contactChannels.find((channel) => channel.id === "email");
  const phone = contactChannels.find((channel) => channel.id === "phone");
  const location = contactChannels.find((channel) => channel.id === "location");
  const emailHref = email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
    ? `mailto:${email.value}`
    : undefined;
  const phoneNumber = phone?.value.replace(/[\s().-]/g, "") ?? "";
  const phoneHref = /^\+?\d{7,15}$/.test(phoneNumber)
    ? `tel:${phoneNumber}`
    : undefined;

  return (
    <Section padding="none" className="pb-12 sm:pb-16">
      <Container>
        <div className="grid items-start gap-8 border-t border-neutral-200 pt-7 sm:pt-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-12">
          <section aria-labelledby="official-contact-heading" className="min-w-0">
            <h2 id="official-contact-heading" className="text-lg font-semibold text-primary-900">
              Kontak Resmi
            </h2>
            <dl className="mt-4 divide-y divide-neutral-200">
              <div className="pb-5">
                  <dt className="flex items-center gap-3 text-xs font-medium text-foreground-muted">
                    <Mail aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-700" />
                    Email organisasi
                  </dt>
                  <dd className="ml-8 mt-1 min-w-0">
                    {emailHref ? (
                      <a href={emailHref} className={contactLinkClassName}>{email?.value}</a>
                    ) : (
                      <span className="text-sm text-foreground-muted">Email belum tersedia.</span>
                    )}
                  </dd>
              </div>
              <div className="py-5">
                  <dt className="flex items-center gap-3 text-xs font-medium text-foreground-muted">
                    <Phone aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-700" />
                    Telepon
                  </dt>
                  <dd className="ml-8 mt-1 min-w-0">
                    {phoneHref ? (
                      <a href={phoneHref} className={contactLinkClassName}>{phone?.value}</a>
                    ) : (
                      <span className="text-sm leading-6 text-foreground-muted">Nomor telepon belum tersedia.</span>
                    )}
                  </dd>
              </div>
              {location?.value && (
                <div className="py-5">
                    <dt className="flex items-center gap-3 text-xs font-medium text-foreground-muted">
                      <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-primary-700" />
                      Wilayah organisasi
                    </dt>
                    <dd className="ml-8 mt-1 wrap-anywhere text-base font-medium leading-6 text-primary-900">{location.value}</dd>
                </div>
              )}
            </dl>
            <LocationSection />
          </section>
          <CollaborationCta emailHref={emailHref} />
        </div>
      </Container>
    </Section>
  );
}
