-- Schema foundation only: public visibility queries remain unchanged.
-- Pause content writes during deployment so legacy backfill has a fixed boundary.
BEGIN;

CREATE TYPE "ReviewStatus" AS ENUM (
    'DRAFT', 'PENDING_REVIEW', 'REVISION_REQUIRED', 'APPROVED'
);

ALTER TABLE "News"
    ADD COLUMN "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN "reviewerId" TEXT,
    ADD COLUMN "reviewedAt" TIMESTAMP(3),
    ADD COLUMN "reviewNote" TEXT,
    ADD COLUMN "contentVersion" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "Event"
    ADD COLUMN "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN "reviewerId" TEXT,
    ADD COLUMN "reviewedAt" TIMESTAMP(3),
    ADD COLUMN "reviewNote" TEXT,
    ADD COLUMN "contentVersion" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "Publication"
    ADD COLUMN "authorId" TEXT,
    ADD COLUMN "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
    ADD COLUMN "reviewerId" TEXT,
    ADD COLUMN "reviewedAt" TIMESTAMP(3),
    ADD COLUMN "reviewNote" TEXT,
    ADD COLUMN "contentVersion" INTEGER NOT NULL DEFAULT 1;

-- Only known published records are grandfathered. ARCHIVED stays ARCHIVED,
-- with reviewStatus DRAFT because its past approval cannot be established.
UPDATE "News" SET "reviewStatus" = 'APPROVED' WHERE "status" = 'PUBLISHED';
UPDATE "Event" SET "reviewStatus" = 'APPROVED' WHERE "status" = 'PUBLISHED';

-- Includes future schedules; preserve publishedAt exactly, including NULLs.
UPDATE "Publication" SET "reviewStatus" = 'APPROVED'
WHERE "publishedAt" IS NOT NULL;

-- Never invent legacy authors, reviewers, review dates, or review notes.
ALTER TABLE "News" ADD CONSTRAINT "News_reviewerId_fkey"
    FOREIGN KEY ("reviewerId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Event" ADD CONSTRAINT "Event_reviewerId_fkey"
    FOREIGN KEY ("reviewerId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_reviewerId_fkey"
    FOREIGN KEY ("reviewerId") REFERENCES "User"("id")
    ON DELETE RESTRICT ON UPDATE CASCADE;

COMMIT;
