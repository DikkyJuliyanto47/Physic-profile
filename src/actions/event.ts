"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { EventCategory, ContentStatus } from "@/generated/prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export type EventInput = {
  title: string;
  slug?: string;
  category: EventCategory;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  linkUrl?: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createEvent(data: EventInput): Promise<ActionResponse> {
  try {
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul event wajib diisi." };
    }
    if (!data.description || data.description.trim().length === 0) {
      return { success: false, error: "Deskripsi event wajib diisi." };
    }
    if (!data.startDate) {
      return { success: false, error: "Tanggal mulai wajib diisi." };
    }

    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Slug event sudah ada." };
    }

    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await prisma.event.create({
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        description: data.description.trim(),
        startDate,
        endDate,
        location: data.location?.trim() || null,
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        authorId: session.user.id,
      },
    });

    updateTag("events");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat event. Silakan coba lagi." };
  }
}

export async function updateEvent(
  id: string,
  data: EventInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul event wajib diisi." };
    }
    if (!data.description || data.description.trim().length === 0) {
      return { success: false, error: "Deskripsi event wajib diisi." };
    }
    if (!data.startDate) {
      return { success: false, error: "Tanggal mulai wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.title);

    const existing = await prisma.event.findFirst({
      where: { slug, NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Slug event sudah ada." };
    }

    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await prisma.event.update({
      where: { id },
      data: {
        title: data.title.trim(),
        slug,
        category: data.category,
        description: data.description.trim(),
        startDate,
        endDate,
        location: data.location?.trim() || null,
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
      },
    });

    updateTag("events");
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    revalidatePath("/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui event." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    await prisma.event.delete({ where: { id } });
    updateTag("events");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus event." };
  }
}

export async function toggleEventStatus(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    const newStatus =
      event.status === "PUBLISHED" ? ContentStatus.DRAFT : ContentStatus.PUBLISHED;

    await prisma.event.update({
      where: { id },
      data: { status: newStatus },
    });

    updateTag("events");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status event." };
  }
}
