-- CreateEnum: MessageStatus
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'REPLIED');

-- AlterTable: Add status column to ContactMessage
ALTER TABLE "ContactMessage" ADD COLUMN "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD';
