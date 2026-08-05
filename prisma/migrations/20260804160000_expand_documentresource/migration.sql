-- AlterTable: Expand DocumentResource with new columns
ALTER TABLE "DocumentResource" ADD COLUMN "fileType" TEXT,
ADD COLUMN "fileSize" TEXT,
ADD COLUMN "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN "uploaderId" TEXT,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "DocumentResource_uploaderId_idx" ON "DocumentResource"("uploaderId");

-- AddForeignKey
ALTER TABLE "DocumentResource" ADD CONSTRAINT "DocumentResource_uploaderId_fkey" FOREIGN KEY ("uploaderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
