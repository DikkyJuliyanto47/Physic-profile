/*
 * @Author: galhkoernia 
 * @Date: 2026-08-07 19:26:35 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 22:48:18
 */

import { Container } from "./Container";
import { Section } from "./Section";
import { PageBreadcrumb, type BreadcrumbItem } from "./PageBreadcrumb";

interface PageHeaderProps {
  breadcrumb?: BreadcrumbItem[];

  eyebrow: string;
  title: string;
  description?: string;

  children?: React.ReactNode;
}

export function PageHeader({
  breadcrumb,
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <Section className="py-12 md:py-16">
      <Container>
        {breadcrumb && (
          <PageBreadcrumb items={breadcrumb} />
        )}

        <div className="mt-6 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600">
            {eyebrow}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            {title}
          </h1>

          {description && (
            <p className="mt-5 text-lg leading-8 text-foreground-muted">
              {description}
            </p>
          )}

          {children}
        </div>
      </Container>
    </Section>
  );
}