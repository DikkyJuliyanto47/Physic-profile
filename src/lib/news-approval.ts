import "server-only";
import { prisma } from "@/lib/prisma";
import { ContentWorkflowError } from "./content-workflow";
import type { Prisma } from "@/generated/prisma/client";

export const NEWS_APPROVAL_UNAVAILABLE = "Persetujuan Berita belum diaktifkan. Hubungi pengelola sistem.";

export async function isNewsApprovalReady() {
  try {
    await prisma.news.findFirst({ select: { reviewStatus: true, reviewerId: true,
      reviewedAt: true, reviewNote: true, contentVersion: true, pendingRevision: true } });
    return true;
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "P2022") return false;
    throw error;
  }
}

export async function requireNewsApproval() {
  if (!await isNewsApprovalReady()) throw new ContentWorkflowError(NEWS_APPROVAL_UNAVAILABLE);
}

export async function verifyNewsActor(tx: Prisma.TransactionClient, user: { id: string; sessionVersion?: number }) {
  const account = await tx.user.findUnique({ where: { id: user.id },
    select: { id: true, role: true, isActive: true, sessionVersion: true } });
  if (!account?.isActive || account.sessionVersion !== user.sessionVersion) {
    throw new ContentWorkflowError("Sesi tidak valid. Silakan login kembali.");
  }
  return account;
}

export function newsActionError(error: unknown) {
  if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
  const code = typeof error === "object" && error !== null && "code" in error ? error.code : undefined;
  if (code === "P2022") return { success: false, error: NEWS_APPROVAL_UNAVAILABLE };
  if (code === "P2002") return { success: false, error: "Alamat berita sudah digunakan. Gunakan judul lain." };
  if (code === "P2034") return { success: false, error: "Konten berubah bersamaan. Muat ulang sebelum mencoba lagi." };
  console.error("[news-approval] Operation failed:", error);
  return { success: false, error: "Gagal menyimpan berita. Silakan coba lagi." };
}
