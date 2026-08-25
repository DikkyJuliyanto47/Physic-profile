import { Container } from "./Container";
import type { ReactNode } from "react";
import Image from "next/image";

type HeroBreadcrumb = {
  label: string;
  href?: string;
};

type HeroProps = {
  title: string;
  breadcrumbs?: HeroBreadcrumb[];
  children?: ReactNode;
  className?: string;
};

const HERO_IMAGE = "/assets/hero/pertemuan-07-27-03.jpeg";

export function Hero({ title, breadcrumbs = [], children, className = "" }: HeroProps) {
  return (
    <section className={`relative isolate ${className}`}>
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={HERO_IMAGE}
          alt=""
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-primary-950/65" />
      </div>

      <Container>
        <div className="relative flex min-h-72 flex-col justify-between py-8 sm:min-h-80 sm:py-9 lg:min-h-88 lg:py-10">
          {breadcrumbs.length > 0 ? (
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-2 text-sm font-medium text-white/80">
                {breadcrumbs.map((item, index) => (
                  <li key={`${item.label}-${index}`} className="flex items-center gap-2">
                    {item.href ? (
                      <a href={item.href} className="transition-colors hover:text-white">
                        {item.label}
                      </a>
                    ) : (
                      <span>{item.label}</span>
                    )}

                    {index < breadcrumbs.length - 1 ? (
                      <span aria-hidden="true" className="text-white/45">
                        ›
                      </span>
                    ) : null}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}

          <div className="absolute inset-x-4 bottom-0 translate-y-1/2 border border-neutral-200 bg-background sm:inset-x-6 lg:inset-x-8">
            <div className="flex min-h-24 flex-col justify-center gap-5 px-6 py-5 sm:min-h-28 sm:px-8 sm:py-6 lg:flex-row lg:items-center lg:justify-between lg:px-10">
              <h1 className="max-w-3xl text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl lg:text-4xl">
                {title}
              </h1>

              {children ? <div className="shrink-0">{children}</div> : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}