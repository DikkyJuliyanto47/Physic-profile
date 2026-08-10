-- AlterTable: Add nidn and position columns to MemberProfile
ALTER TABLE "MemberProfile" ADD COLUMN "nidn" TEXT,
ADD COLUMN "position" TEXT;
