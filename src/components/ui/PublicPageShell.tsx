import type { ReactNode } from "react";

import {
  Container,
  Hero,
  Section,
  SectionNav,
  ShareActions,
} from "@/components/ui/index";

interface PublicPageShellProps {
  title: string;
  description?: string;
  breadcrumbs: { label: string; href?: string }[];
  navItems?: { label: string; href: string }[];
  defaultActiveHref?: string;
  children: ReactNode;
}

export function PublicPageShell({
  title,
  description,
  breadcrumbs,
  navItems = [],
  defaultActiveHref,
  children,
}: PublicPageShellProps) {
  const hasNavigation = navItems.length > 0;
  const heading = (
    <h1 className="max-w-3xl text-xl font-bold leading-tight tracking-tight text-foreground sm:text-2xl lg:text-3xl">
      {title}
    </h1>
  );

  return (
    <>
      <Hero title={title} breadcrumbs={breadcrumbs} />

      <Section tone="muted" padding="none">
        <Container>
          <div className="relative z-10 -mt-14 pb-16 sm:-mt-16 sm:pb-20 lg:-mt-20 lg:pb-24">
            <div className="relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 left-[calc(100%+16px)] top-0 z-0 hidden w-32 bg-[url('/images/patterns/psi-batik.svg')] bg-right bg-size-[auto_100%] bg-no-repeat opacity-[0.07] 2xl:block 2xl:w-36"
              />

              <div className="relative z-10 border border-neutral-200 bg-background">

                <header className="sticky top-0 z-20 border-b border-neutral-200 bg-background px-6 py-5 sm:px-8 lg:px-10">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    {description ? (
                      <div className="min-w-0 max-w-3xl">
                        {heading}
                        <p className="mt-2 text-sm leading-6 text-foreground-muted">
                          {description}
                        </p>
                      </div>
                    ) : heading}

                    <ShareActions title={title} />
                  </div>
                </header>

                <div
                  className={
                    hasNavigation
                      ? "grid lg:grid-cols-[200px_minmax(0,1fr)]"
                      : "grid"
                  }
                >
                  {hasNavigation && (
                    <aside className="self-stretch border-b border-neutral-200 lg:border-b-0 lg:border-r">
                      <div className="lg:sticky lg:top-24">
                        <SectionNav
                          items={navItems}
                          defaultActiveHref={defaultActiveHref}
                        />
                      </div>
                    </aside>
                  )}

                  <main className="min-w-0 px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
                    {children}
                  </main>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
