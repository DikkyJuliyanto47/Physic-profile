-- Optional calendar date; existing rows remain NULL without backfill.
ALTER TABLE "News" ADD COLUMN "eventDate" TIMESTAMP(3);
