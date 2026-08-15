-- DropIndex
DROP INDEX "DocumentResource_uploaderId_idx";

-- AlterTable
ALTER TABLE "DocumentResource" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Gallery" ALTER COLUMN "updatedAt" DROP DEFAULT;
