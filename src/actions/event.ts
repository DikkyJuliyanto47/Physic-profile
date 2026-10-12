"use server";

import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import { EventCategory, ContentStatus } from "@/generated/prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type EventInput = {
  title: string;
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

function validateEventInput(data: EventInput): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data event tidak valid.";
  if (typeof data.title !== "string" || !data.title.trim()) return "Judul event wajib diisi.";
  if (typeof data.description !== "string" || !data.description.trim()) return "Deskripsi event wajib diisi.";
  if (typeof data.startDate !== "string" || !data.startDate.trim()) return "Tanggal mulai wajib diisi.";
  if (Number.isNaN(new Date(data.startDate).getTime())) return "Tanggal mulai tidak valid.";
  if (data.endDate !== undefined && (typeof data.endDate !== "string" ||
    (data.endDate !== "" && Number.isNaN(new Date(data.endDate).getTime())))) return "Tanggal selesai tidak valid.";
  if (!Object.values(EventCategory).some((value) => value === data.category)) return "Kategori event tidak valid.";
  if (!Object.values(ContentStatus).some((value) => value === data.status)) return "Status event tidak valid.";
  if ([data.location, data.linkUrl, data.imageUrl].some(
    (value) => value != null && typeof value !== "string",
  )) return "Field event harus berupa teks.";
  return null;
}

export async function createEvent(data: EventInput): Promise<ActionResponse> {
  try {
    const validationError = validateEventInput(data);
    if (validationError) return { success: false, error: validationError };

    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    } 
    const slug = slugify(data.title);
    if (!slug) {
      return { success: false, error: "Judul event harus mengandung huruf atau angka." };
    }

    const existing = await prisma.event.findUnique({ where: { slug } });
    if (existing) {
      return { success: false, error: "Judul event menghasilkan alamat yang sudah digunakan. Gunakan judul lain." };
    }

    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await mutateWithMedia(data, (tx) => tx.event.create({
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
    }));

    updateTag("events");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("[createEvent] Gagal membuat event:", error);
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

    const validationError = validateEventInput(data);
    if (validationError) return { success: false, error: validationError };

    const startDate = new Date(data.startDate);
    const endDate = data.endDate ? new Date(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await mutateWithMedia(data, (tx) => tx.event.update({
      where: { id },
      data: {
        title: data.title.trim(),
        category: data.category,
        description: data.description.trim(),
        startDate,
        endDate,
        location: data.location?.trim() || null,
        linkUrl: data.linkUrl?.trim() || null,
        imageUrl: data.imageUrl?.trim() || null,
        status: data.status,
      },
    }), (tx) => tx.event.findUnique({ where: { id } }));

    updateTag("events");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("[updateEvent] Gagal memperbarui event:", error);
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

    await mutateWithMedia(null, (tx) => tx.event.delete({ where: { id } }), (tx) => tx.event.findUnique({ where: { id } }));
    updateTag("events");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("[deleteEvent] Gagal menghapus event:", error);
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
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    console.error("[toggleEventStatus] Gagal mengubah status event:", error);
    return { success: false, error: "Gagal mengubah status event." };
  }
}
