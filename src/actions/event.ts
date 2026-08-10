"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
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
  location: string;
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
    if (!data.location || data.location.trim().length === 0) {
      return { success: false, error: "Lokasi event wajib diisi." };
    }

    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Anda harus login untuk membuat event." };
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
        location: data.location.trim(),
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
        authorId: session.user.id,
      },
    });

    revalidatePath("/admin/events");
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
    if (!data.title || data.title.trim().length === 0) {
      return { success: false, error: "Judul event wajib diisi." };
    }
    if (!data.description || data.description.trim().length === 0) {
      return { success: false, error: "Deskripsi event wajib diisi." };
    }
    if (!data.startDate) {
      return { success: false, error: "Tanggal mulai wajib diisi." };
    }
    if (!data.location || data.location.trim().length === 0) {
      return { success: false, error: "Lokasi event wajib diisi." };
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
        location: data.location.trim(),
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui event." };
  }
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    if (!event) {
      return { success: false, error: "Event tidak ditemukan." };
    }

    await prisma.event.delete({ where: { id } });
    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus event." };
  }
}

export async function toggleEventStatus(id: string): Promise<ActionResponse> {
  try {
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

    revalidatePath("/admin/events");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status event." };
  }
}
