# Content Approval: controlled database activation

Prepared against the Prisma CLI database (`DATABASE_URL` from the current process
and `.env`) using a REPEATABLE READ / READ ONLY transaction on 2026-10-16.
No migration, seed, reset, or database write was executed during preparation.

## Observed compatibility

- Database is the pre-approval baseline. `User.sessionVersion` and `News.eventDate`
  exist. ReviewStatus/ContentModule/ChangeOperation, ContentChange and all six News
  approval columns are absent. Therefore there are no News revision snapshots to move.
- Both 20261015 approval migrations have not run. They modify Event/Publication
  beyond the active schema and do not supply ContentChange. Their SQL is unchanged.
- Four present applied migration files have matching SHA-256 checksums. The applied
  `20260928000000_normalize_image_urls` file is missing locally and was not found
  in available Git history. Do not fabricate a replacement or edit its ledger entry.
  Recorded checksum: `03c090c7e936a9512202dec67e8f3684dac8ac6ef1af0bd9178592fb823fefba`.
- Counts: User 2 (one active ADMIN, one active SUPER_ADMIN), News 2 (both PUBLISHED),
  Event 1, MemberProfile 8, University 9, Publication 2, Gallery 2; no periods/positions.

## What this migration does

`20261016000000_central_content_approval/migration.sql` adds only the objects needed
by the current schema: three enums, the News review fields/FK, ContentChange/FKs,
and its three indexes. Published News receive APPROVED review metadata; their
status, content, timestamps, authors and publication dates do not change.
Event/Publication and all other canonical content are untouched.

News/Event ownership is imported from their existing authorId. The other 21 legacy
items have no provable author in the schema; they remain public and SUPER_ADMIN-only.
The SQL contains an optional, validated owner mapping section. Populate it only
with verified `(kind, targetId, User.id)` entries before first application. Empty
mapping is safe and does not assign all content to an arbitrary account.

The migration intentionally rejects an already/partially provisioned approval
schema or a database where either historical approval migration has run. Such a
database needs a different reconciliation. It never clears existing snapshots,
overwrites a queue, or computes an incompatible SQL replacement for JS baseHash.

## Application commands (operator only; not executed)

1. Verify that Prisma CLI and the deployed app target the same database. Take a
   restorable backup and stop every content writer/old app instance. Public reads
   may briefly wait for the News ALTER lock. Lock acquisition times out after 5s;
   any error rolls back the entire script. There is no automatic retry.
2. Review the SQL and optional owner mappings. Do **not** run `migrate deploy`:
   it would execute the two incompatible historical pending migrations first.
3. Apply **only** the reviewed SQL, from the repository root (PowerShell):

```powershell
npx.cmd prisma db execute --file prisma/migrations/20261016000000_central_content_approval/migration.sql
if ($LASTEXITCODE -ne 0) { throw "Approval activation failed; do not resolve or continue." }
```

4. Only after that command succeeds, record the migration actually executed:

```powershell
npx.cmd prisma migrate resolve --applied 20261016000000_central_content_approval
```

`db execute` itself does not update `_prisma_migrations`. Do not mark the old
approval migrations applied: their SQL has not run. If ledger reconciliation is
blocked, stop and retain the execution record; do not reapply this SQL (its guards
will reject it). The two old migrations stay pending, and the missing applied
historical file still blocks a clean reproducible migration history. Restore its
original bytes from a trusted backup and separately agree a history reconciliation
before returning to normal `migrate deploy` / shadow-database workflows.

Once SQL is applied, the existing application readiness check can enable content
writes. Resume only the current centralized-approval version, with the Prisma
Client generated from the current main schema. Manual functional checks are owned
by the operator; no tests or build are part of this preparation.
