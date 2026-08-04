"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { MessageStatus } from "@/generated/prisma/client";

export type MessageFilters = {
  q?: string;
  status?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function getMessages(filters: MessageFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.q) {
    where.OR = [
      { name: { contains: filters.q, mode: "insensitive" } },
      { email: { contains: filters.q, mode: "insensitive" } },
      { subject: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  if (filters.status && ["UNREAD", "READ", "REPLIED"].includes(filters.status)) {
    where.status = filters.status as MessageStatus;
  }

  const [messages, unreadCount] = await Promise.all([
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.contactMessage.count({
      where: { status: "UNREAD" },
    }),
  ]);

  return { messages, unreadCount };
}

export async function markAsRead(id: string): Promise<ActionResponse> {
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      return { success: false, error: "Pesan tidak ditemukan." };
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: true, status: "READ" },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menandai pesan." };
  }
}

export async function markAsUnread(id: string): Promise<ActionResponse> {
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      return { success: false, error: "Pesan tidak ditemukan." };
    }

    await prisma.contactMessage.update({
      where: { id },
      data: { isRead: false, status: "UNREAD" },
    });

    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menandai pesan." };
  }
}

export async function deleteMessage(id: string): Promise<ActionResponse> {
  try {
    const msg = await prisma.contactMessage.findUnique({ where: { id } });
    if (!msg) {
      return { success: false, error: "Pesan tidak ditemukan." };
    }

    await prisma.contactMessage.delete({ where: { id } });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus pesan." };
  }
}
