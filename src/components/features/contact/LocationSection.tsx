import { ArrowUpRight } from "lucide-react";
import { secretariat } from "./data";

export function LocationSection() {
  const mapsHref = secretariat.mapsHref?.startsWith("https://www.google.com/maps")
    ? secretariat.mapsHref
    : undefined;

  return (
    <section aria-labelledby="contact-secretariat-heading" className="border-t border-neutral-200 pt-5">
      <h3 id="contact-secretariat-heading" className="text-sm font-semibold text-primary-900">
        Sekretariat {secretariat.name}
      </h3>
      <div className="mt-2 text-sm leading-6 text-foreground-muted">
        {secretariat.addressLines.map((line) => <p key={line} className="wrap-anywhere">{line}</p>)}
      </div>
      {mapsHref && (
        <a
          href={mapsHref}
          className="mt-2 inline-flex min-h-10 items-center gap-1.5 rounded-sm text-sm font-medium text-primary-700 transition-colors duration-150 hover:text-primary-900 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 motion-reduce:transition-none"
        >
          Lihat lokasi di Google Maps
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />
        </a>
      )}
    </section>
  );
}
