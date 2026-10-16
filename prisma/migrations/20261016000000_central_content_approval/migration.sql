-- Target: the inspected pre-approval database (2026-10-16).
-- Apply this file in isolation; DO NOT use migrate deploy while the two older
-- approval migrations remain pending. See prisma/CONTENT_APPROVAL_ACTIVATION.md.
-- Stop all content writers and take a backup before execution.
-- Deliberately fail on an already/partially migrated database instead of hiding
-- divergent definitions behind IF NOT EXISTS or overwriting queued proposals.
BEGIN;
SET LOCAL search_path = public, pg_temp;
SET LOCAL lock_timeout = '5s';
SET LOCAL statement_timeout = '60s';

LOCK TABLE "User", "News", "Event", "MemberProfile", "ManagementPeriod",
  "ManagementPosition", "University", "Publication", "Gallery"
  IN SHARE ROW EXCLUSIVE MODE;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "_prisma_migrations"
    WHERE rolled_back_at IS NULL AND finished_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Unresolved migration failure; reconcile history before activation';
  END IF;
  IF EXISTS (
    SELECT 1 FROM "_prisma_migrations"
    WHERE migration_name IN (
      '20261015000000_content_approval_foundation',
      '20261015010000_approval_activation_legacy'
    ) AND rolled_back_at IS NULL
  ) THEN
    RAISE EXCEPTION 'Historical approval migration has run; this baseline migration is not applicable';
  END IF;
  IF to_regclass('public."ContentChange"') IS NOT NULL
    OR to_regtype('public."ReviewStatus"') IS NOT NULL
    OR to_regtype('public."ContentModule"') IS NOT NULL
    OR to_regtype('public."ChangeOperation"') IS NOT NULL
    OR EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'News'
        AND column_name IN ('reviewStatus', 'reviewerId', 'reviewedAt',
          'reviewNote', 'contentVersion', 'pendingRevision')
    ) THEN
    RAISE EXCEPTION 'Approval objects or News snapshots may already exist; stop and prepare a snapshot-aware reconciliation';
  END IF;
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND ((table_name = 'Event' AND column_name IN
        ('reviewStatus', 'reviewerId', 'reviewedAt', 'reviewNote', 'contentVersion'))
        OR (table_name = 'Publication' AND column_name IN
        ('authorId', 'status', 'reviewStatus', 'reviewerId', 'reviewedAt', 'reviewNote', 'contentVersion')))
  ) THEN
    RAISE EXCEPTION 'Unexpected historical Event/Publication approval fields; do not apply this migration';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'User'
      AND column_name = 'sessionVersion' AND udt_name = 'int4' AND is_nullable = 'NO'
  ) OR NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'News'
      AND column_name = 'eventDate' AND udt_name = 'timestamp'
  ) THEN
    RAISE EXCEPTION 'Required baseline sessionVersion/eventDate fields are missing';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM "User" WHERE role = 'SUPER_ADMIN' AND "isActive") THEN
    RAISE EXCEPTION 'No active Super Admin can review proposals';
  END IF;
  IF EXISTS (
    SELECT 1 FROM pg_trigger
    WHERE tgrelid = 'public."News"'::regclass AND NOT tgisinternal
  ) THEN
    RAISE EXCEPTION 'Custom News triggers require review before preserving canonical timestamps';
  END IF;
END;
$$;

CREATE TYPE "ReviewStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'REVISION_REQUIRED', 'APPROVED');
CREATE TYPE "ContentModule" AS ENUM
  ('news', 'event', 'member', 'managementPeriod', 'managementPosition', 'university', 'publication', 'gallery');
CREATE TYPE "ChangeOperation" AS ENUM ('CREATE', 'UPDATE', 'DELETE');

ALTER TABLE "News"
  ADD COLUMN "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'DRAFT',
  ADD COLUMN "reviewerId" TEXT,
  ADD COLUMN "reviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewNote" TEXT,
  ADD COLUMN "contentVersion" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "pendingRevision" JSONB;
ALTER TABLE "News" ADD CONSTRAINT "News_reviewerId_fkey"
  FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Only new review metadata changes. Canonical content, status, author,
-- createdAt, updatedAt and publishedAt remain byte-for-byte unchanged.
UPDATE "News" SET "reviewStatus" = 'APPROVED' WHERE "status" = 'PUBLISHED';

CREATE TABLE "ContentChange" (
  "id" TEXT NOT NULL,
  "kind" "ContentModule" NOT NULL,
  "targetId" TEXT NOT NULL,
  "operation" "ChangeOperation" NOT NULL,
  "payload" JSONB,
  "before" JSONB,
  "baseHash" TEXT,
  "authorId" TEXT NOT NULL,
  "submittedById" TEXT NOT NULL,
  "reviewStatus" "ReviewStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "contentVersion" INTEGER NOT NULL DEFAULT 1,
  "reviewerId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "reviewNote" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentChange_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContentChange_authorId_fkey" FOREIGN KEY ("authorId")
    REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ContentChange_submittedById_fkey" FOREIGN KEY ("submittedById")
    REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ContentChange_reviewerId_fkey" FOREIGN KEY ("reviewerId")
    REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "ContentChange_kind_targetId_key" ON "ContentChange"("kind", "targetId");
CREATE INDEX "ContentChange_reviewStatus_updatedAt_idx" ON "ContentChange"("reviewStatus", "updatedAt");
CREATE INDEX "ContentChange_authorId_reviewStatus_idx" ON "ContentChange"("authorId", "reviewStatus");

-- No snapshots can exist in the inspected baseline: pendingRevision was absent.
-- The precondition above aborts if this changes; never discard or blindly copy a
-- snapshot with a baseHash incompatible with the application's JS serialization.
CREATE TEMP TABLE _approval_legacy_owners (
  kind "ContentModule" NOT NULL,
  target_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  PRIMARY KEY (kind, target_id)
) ON COMMIT DROP;

INSERT INTO _approval_legacy_owners (kind, target_id, author_id)
  SELECT 'news'::"ContentModule", id, "authorId" FROM "News"
  UNION ALL
  SELECT 'event'::"ContentModule", id, "authorId" FROM "Event";

-- OPTIONAL, before first application: add only explicitly verified legacy owners
-- for member/managementPeriod/managementPosition/university/publication/gallery.
-- Do not infer ownership from email, institution, or the number of admin accounts.
-- INSERT INTO _approval_legacy_owners (kind, target_id, author_id) VALUES
--   ('member', '<existing MemberProfile.id>', '<verified User.id>');
-- Without a verified mapping those records remain public and SUPER_ADMIN-only.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM _approval_legacy_owners o
    LEFT JOIN "User" u ON u.id = o.author_id
    WHERE u.id IS NULL OR u.role::text NOT IN ('ADMIN', 'SUPER_ADMIN')
  ) THEN RAISE EXCEPTION 'Legacy owner must reference an existing administrator'; END IF;
  IF EXISTS (
    WITH records(kind, target_id) AS (
      SELECT 'news'::"ContentModule", id FROM "News" UNION ALL
      SELECT 'event'::"ContentModule", id FROM "Event" UNION ALL
      SELECT 'member'::"ContentModule", id FROM "MemberProfile" UNION ALL
      SELECT 'managementPeriod'::"ContentModule", id FROM "ManagementPeriod" UNION ALL
      SELECT 'managementPosition'::"ContentModule", id FROM "ManagementPosition" UNION ALL
      SELECT 'university'::"ContentModule", id FROM "University" UNION ALL
      SELECT 'publication'::"ContentModule", id FROM "Publication" UNION ALL
      SELECT 'gallery'::"ContentModule", id FROM "Gallery"
    )
    SELECT 1 FROM _approval_legacy_owners o
    LEFT JOIN records r ON r.kind = o.kind AND r.target_id = o.target_id
    WHERE r.target_id IS NULL
  ) THEN RAISE EXCEPTION 'Legacy ownership mapping references missing content'; END IF;
END;
$$;

-- Import ownership as settled metadata, not as a pending content mutation.
-- No reviewer or review time is invented. SQL IDs need not be CUIDs: the schema
-- stores plain TEXT and Prisma's cuid() default is client-side only.
INSERT INTO "ContentChange" (
  "id", "kind", "targetId", "operation", "authorId", "submittedById",
  "reviewStatus", "updatedAt"
)
SELECT 'legacy_' || md5(kind::text || ':' || target_id), kind, target_id,
  'UPDATE'::"ChangeOperation", author_id, author_id, 'APPROVED'::"ReviewStatus", CURRENT_TIMESTAMP
FROM _approval_legacy_owners;

COMMIT;
