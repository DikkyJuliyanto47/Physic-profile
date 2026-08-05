/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 08:20:54 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 08:35:39
 */

import { Container, Section, SectionHeading } from "@/components/ui/index";
import { aboutHighlights } from "./data";

export function AboutSection() {
    return (
        <Section>
            <Container className="grid gap-12 lg:grid-cols-2 lg:items-center">
                <div className="flex flex-col gap-6">
                    <SectionHeading 
                        eyebrow="Tentang Kami"
                        title="Sekilas tentang PSI Cabang Surabaya"    
                    />
                    <p className="text-foreground-muted">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                        enim ad minim veniam, quis nostrud exercitation ullamco laboris
                        nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat
                        nulla pariatur.
                    </p>
                    <div className="grid gap-4 sm:grid-cols-3">
                        {aboutHighlights.map((highlight) => (
                            <div
                                key={highlight.id}
                                className="flex flex-col gap-2 rounded-lg lg-background-muted p-4"
                            >
                                <span className="h-8 w-8 rounded-md bg-primary-600" />
                                <span className="text-sm font-semibold text-foreground">
                                    {highlight.title}
                                </span>
                                <span className="text-xs text-foreground-muted">
                                    {highlight.description}Se
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div
                    aria-hidden="true"
                    className="relative hidden h-72 items-center justify-center lg:flex"
                >
                    <div className="absolute h-56 w-72 rotate-6 rounded-3xl bg-primary-300" />
                    <div className="absolute h-56 w-72 -rotate-3 rounded-3xl bg:gradient-to-br from-primary-500 to-primary-700" />
                </div>
            </Container>
        </Section>
    );
}