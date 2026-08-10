-- AlterTable: Add slug and address columns to University
ALTER TABLE "University" ADD COLUMN "slug" TEXT,
ADD COLUMN "address" TEXT;

-- Populate slug for existing rows based on name
UPDATE "University" SET "slug" = LOWER(REPLACE(REPLACE(REPLACE("name", ' ', '-'), '.', ''), ',', ''));
UPDATE "University" SET "slug" = 'unesa' WHERE "shortName" = 'UNESA';
UPDATE "University" SET "slug" = 'unair' WHERE "shortName" = 'UNAIR';
UPDATE "University" SET "slug" = 'its' WHERE "shortName" = 'ITS';
UPDATE "University" SET "slug" = 'upn' WHERE "shortName" = 'UPN';
UPDATE "University" SET "slug" = 'ukwms' WHERE "shortName" = 'UKWMS';
UPDATE "University" SET "slug" = 'unej' WHERE "shortName" = 'UNEJ';
UPDATE "University" SET "slug" = 'uim' WHERE "shortName" = 'UIM';
UPDATE "University" SET "slug" = 'uniba' WHERE "shortName" = 'UNIBA';
UPDATE "University" SET "slug" = 'unu-pasuruan' WHERE "shortName" = 'UNU Pasuruan';

-- CreateIndex: Unique constraint on slug
CREATE UNIQUE INDEX "University_slug_key" ON "University"("slug");
