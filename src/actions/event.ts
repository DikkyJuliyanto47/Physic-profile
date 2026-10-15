"use server";

import { reviewContent } from "./content-review";
import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { ContentWorkflowError, assertEditable, assertVersion, publicationReview } from "@/lib/content-workflow";
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
  contentVersion?: number;
  title: string;
  category: EventCategory;
  description: string;
  // Offset-free datetime-local values are WIB; ISO values with an offset are instants.
  startDate: string;
  endDate?: string;
  location?: string;
  linkUrl?: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = {
  success: boolean;
  id?: string;
  error?: string;
};

function parseEventDate(value: string): Date {
  const localDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?$/;
  const absoluteDateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/i;

  // Jakarta uses UTC+07:00; never let the server infer a timezone.
  if (localDateTime.test(value)) return new Date(`${value}+07:00`);
  if (absoluteDateTime.test(value)) return new Date(value);
  return new Date(NaN);
}

function validateEventInput(data: EventInput): string | null {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "Data event tidak valid.";
  if (typeof data.title !== "string" || !data.title.trim()) return "Judul event wajib diisi.";
  if (typeof data.description !== "string" || !data.description.trim()) return "Deskripsi event wajib diisi.";
  if (typeof data.startDate !== "string" || !data.startDate.trim()) return "Tanggal mulai wajib diisi.";
  if (Number.isNaN(parseEventDate(data.startDate).getTime())) return "Tanggal mulai tidak valid.";
  if (data.endDate !== undefined && (typeof data.endDate !== "string" ||
    (data.endDate !== "" && Number.isNaN(parseEventDate(data.endDate).getTime())))) return "Tanggal selesai tidak valid.";
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

    const startDate = parseEventDate(data.startDate);
    const endDate = data.endDate ? parseEventDate(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    const reviewStatus = publicationReview(session.user, data.status);
    const created = await mutateWithMedia(data, (tx) => tx.event.create({
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
        reviewStatus,
        reviewerId: reviewStatus === "APPROVED" ? session.user.id : null,
        reviewedAt: reviewStatus === "APPROVED" ? new Date() : null,
        authorId: session.user.id,
      },
    }));

    updateTag("events");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true, id: created.id };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
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

    const startDate = parseEventDate(data.startDate);
    const endDate = data.endDate ? parseEventDate(data.endDate) : null;

    if (endDate && endDate < startDate) {
      return { success: false, error: "Tanggal selesai tidak boleh sebelum tanggal mulai." };
    }

    await mutateWithMedia(data, async (tx) => {
      const currentRecord = await tx.event.findUnique({ where: { id } });
      if (!currentRecord) throw new Error("Konten tidak ditemukan.");
      assertVersion(currentRecord, data.contentVersion);
      assertEditable(session.user, currentRecord);
      const reviewStatus = publicationReview(session.user, data.status);
      return tx.event.update({
        where: { id, contentVersion: currentRecord.contentVersion },
        data: {
          reviewStatus: session.user.role === "ADMIN" && currentRecord.reviewStatus === "REVISION_REQUIRED"
            ? "REVISION_REQUIRED" : reviewStatus,
          reviewerId: reviewStatus === "APPROVED" ? session.user.id : null,
          reviewedAt: reviewStatus === "APPROVED" ? new Date() : null,
          contentVersion: { increment: 1 },
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
      });
    }, (tx) => tx.event.findUnique({ where: { id } }));

    updateTag("events");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
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

    assertEditable(session.user, event);
    await mutateWithMedia(
      null,
      (tx) => tx.event.delete({
        where: { id, contentVersion: event.contentVersion },
      }),
      (tx) => tx.event.findUnique({ where: { id } }),
    );
    updateTag("events");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidatePath("/admin/events");
    revalidatePath("/events");
    return { success: true };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    console.error("[deleteEvent] Gagal menghapus event:", error);
    return { success: false, error: "Gagal menghapus event." };
  }
}

export async function toggleEventStatus(id: string, version?: number): Promise<ActionResponse> {
  const session = await requireAdmin();
  if (session?.user.role !== "SUPER_ADMIN") {
    return { success: false, error: "Akses Super Admin diperlukan." };
  }
  const current = await prisma.event.findUnique({ where: { id } });
  if (!current || version === undefined) return { success: false, error: "Muat ulang konten." };
  return reviewContent("event", id, version,
    current.status === "PUBLISHED" ? "unpublish" : "publish");
}
