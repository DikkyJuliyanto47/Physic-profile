/*
 * @Author: galhkoernia 
 * @Date: 2026-08-09 09:49:26 
 * @Last Modified by:   galhkoernia 
 * @Last Modified time: 2026-08-09 09:49:26 
 */

import { Container, Section } from "@/components/ui";
import { galleryCategories } from "./data";

const ICON_TONE_CLASSES = [
  "bg-primary-100 text-primary-600",
  "bg-primary-200 text-primary-700",
  "bg-primary-50 text-primary-500",
  "bg-primary-900 text-primary-100",
];

export function GalleryCategorySection() {
  return (
    <Section tone="muted">
      <Container className="flex flex-col gap-8">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <span className="text-base font-semibold text-foreground">
            Dokumentasi Kegiatan
          </span>
          <span className="text-sm font-semibold text-primary-600">
            Lihat semua album
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {galleryCategories.map((category, index) => (
            <div
              key={category.id}
              className="flex flex-col gap-3 rounded-lg border border-border bg-background p-5"
            >
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-md ${ICON_TONE_CLASSES[index % ICON_TONE_CLASSES.length]}`}
              >
                <i className="fa-regular fa-folder-open" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-foreground">
                {category.name}
              </span>
              <span className="text-xs text-foreground-muted">
                {category.albumCount} Album &bull; {category.photoCount} Foto
                &bull; {category.videoCount} Video
              </span>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
