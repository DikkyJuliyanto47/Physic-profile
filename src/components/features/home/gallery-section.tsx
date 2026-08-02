/*
 * @Author: galhkoernia 
 * @Date: 2026-08-02 09:04:55 
 * @Last Modified by: galhkoernia
 * @Last Modified time: 2026-08-02 09:09:45
 */

import { Container, Section } from "@/components/ui";
import { galleryItems } from "./data";

export function GallerySection() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col items-center gap-8 text-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold uppercase tracking-[0.3em] text-foreground sm:text-3xl">
            Galeri
          </h2>
          <p className="text-primary-600">
            Dolor sit amet, consectetur adipiscing elit.
          </p>
        </div>

        {galleryItems.map((item) => (
          <div key={item.id} className="flex w-full flex-col gap-3">
            <div className="aspect-21/9 w-full rounded-lg bg-neutral-200" />
            <span className="text-sm font-semibold text-primary-600">
              {item.date}
            </span>
            <p className="text-sm text-foreground-muted">{item.caption}</p>
          </div>
        ))}
      </Container>
    </Section>
  );
}
