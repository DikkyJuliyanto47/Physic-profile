-- Run with all old application writers stopped, BEFORE deploying Phase 03.
-- Phase 02 intentionally left old publication actions working. Reconcile any
-- content published/scheduled by those writers after its initial backfill.
-- Do not rerun this reconciliation after approval enforcement is active.
BEGIN;

-- Publication also needs durable archive/unpublish state, independently of review.
ALTER TABLE "Publication"
    ADD COLUMN "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT';
UPDATE "Publication" SET "status" = 'PUBLISHED'
WHERE "publishedAt" IS NOT NULL;

UPDATE "News" SET "reviewStatus" = 'APPROVED'
WHERE "status" = 'PUBLISHED' AND "reviewStatus" = 'DRAFT';

UPDATE "Event" SET "reviewStatus" = 'APPROVED'
WHERE "status" = 'PUBLISHED' AND "reviewStatus" = 'DRAFT';

UPDATE "Publication" SET "reviewStatus" = 'APPROVED'
WHERE "publishedAt" IS NOT NULL AND "reviewStatus" = 'DRAFT';

-- Existing status/date/content/ownership/reviewer/version fields are not rewritten.
-- ARCHIVED News/Event are deliberately excluded.
COMMIT;
