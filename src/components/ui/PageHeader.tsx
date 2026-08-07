/*
 * @Author: galhkoernia 
 * @Date: 2026-08-07 19:26:35 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-07 19:31:46
 */

import { Container } from "./Container";
import { Section } from "./Section";

interface PageHeaderProps {
    eyebrow: string;
    title: string;
    description?: string;
}

export function PageHeader({ eyebrow, title, description }: PageHeaderProps) {
    return (
        <Section tone="muted" padding="compact">
            <Container className="flex flex-col gap-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary-600">
                    {eyebrow}
                </span>
                <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
                    {title}
                </h1>
                {description ? (
                    <p className="max-w-2xl text-foreground-muted">{description}</p>
                ) : null}
            </Container>
        </Section>
    )
}