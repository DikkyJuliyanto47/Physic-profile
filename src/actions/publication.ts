"use server";

import { prisma } from "@/lib/prisma";
import { mutateWithMedia } from "@/lib/media-lifecycle";
import { ContentWorkflowError, assertEditable, assertVersion, publicationReview } from "@/lib/content-workflow";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import type { PublicationInput, PublicationType } from "@/types/publication";

export type ActionResponse = {
  success: boolean;
  id?: string;
  error?: string;
};

const PUBLICATION_TYPES: readonly PublicationType[] = [
  "JURNAL",
  "BUKU",
  "HKI",
  "PROSIDING",
];

function isPublicationType(value: string): value is PublicationType {
  return PUBLICATION_TYPES.some((type) => type === value);
}

function parsePublishedAt(value: string | undefined): Date | null | "invalid" {
  if (value === undefined || value === "") return null;
  if (typeof value !== "string") return "invalid";

  // Date-only input starts at midnight WIB; retain support for legacy WIB datetimes.
  const input = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00` : value;
  const match = /^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/.exec(input);
  if (!match) return "invalid";

  const normalized = `${match[1]}:${match[2] ?? "00"}.${(match[3] ?? "").padEnd(3, "0")}`;
  const date = new Date(`${normalized}+07:00`);
  if (Number.isNaN(date.getTime())) return "invalid";

  // Reject normalized overflow dates (for example, February 30).
  const roundTrip = new Date(date.getTime() + 7 * 60 * 60 * 1000)
    .toISOString().slice(0, -1);
  return roundTrip === normalized ? date : "invalid";
}

function validateInput(data: PublicationInput): string | null {
  if (!data.title || data.title.trim().length === 0) {
    return "Judul publikasi wajib diisi.";
  }

  if (!isPublicationType(data.type)) {
    return "Tipe publikasi tidak valid.";
  }

  if (data.publishedAt && parsePublishedAt(data.publishedAt) === "invalid") {
    return "Tanggal publikasi tidak valid.";
  }

  return null;
}

export async function createPublication(
  data: PublicationInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validateInput(data);
    if (validationError) return { success: false, error: validationError };

    const publishedAt = parsePublishedAt(data.publishedAt);
    if (publishedAt === "invalid") {
      return { success: false, error: "Tanggal publikasi tidak valid." };
    }

    const reviewStatus = publicationReview(session.user, data.intent === "publish" ? "PUBLISHED" : "DRAFT");
    const created = await mutateWithMedia(data, (tx) => tx.publication.create({
      data: {
        title: data.title.trim(),
        type: data.type,
        description: data.description?.trim() || null,
        externalUrl: data.externalUrl?.trim() || null,
        publishedAt,
        reviewStatus,
        status: reviewStatus === "APPROVED" ? "PUBLISHED" : "DRAFT",
        reviewerId: reviewStatus === "APPROVED" ? session.user.id : null,
        reviewedAt: reviewStatus === "APPROVED" ? new Date() : null,
        authorId: session.user.id,
      },
    }));

    updateTag("publications");
    revalidatePath("/research");
    revalidatePath("/admin/publication");
    return { success: true, id: created.id };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    return {
      success: false,
      error: "Gagal membuat publikasi. Silakan coba lagi.",
    };
  }
}

export async function updatePublication(
  id: string,
  data: PublicationInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const validationError = validateInput(data);
    if (validationError) return { success: false, error: validationError };

    const publication = await prisma.publication.findUnique({
      where: { id },
    });
    if (!publication) {
      return { success: false, error: "Publikasi tidak ditemukan." };
    }

    const publishedAt = parsePublishedAt(data.publishedAt);
    if (publishedAt === "invalid") {
      return { success: false, error: "Tanggal publikasi tidak valid." };
    }

    await mutateWithMedia(data, async (tx) => {
      const currentRecord = await tx.publication.findUnique({ where: { id } });
      if (!currentRecord) throw new Error("Konten tidak ditemukan.");
      assertVersion(currentRecord, data.contentVersion);
      assertEditable(session.user, currentRecord);
      const reviewStatus = publicationReview(session.user, data.intent === "publish" ? "PUBLISHED" : "DRAFT");
      return tx.publication.update({
        where: { id, contentVersion: currentRecord.contentVersion },
        data: {
          status: reviewStatus === "APPROVED" ? "PUBLISHED" : "DRAFT",
          reviewStatus: session.user.role === "ADMIN" && currentRecord.reviewStatus === "REVISION_REQUIRED"
            ? "REVISION_REQUIRED" : reviewStatus,
          reviewerId: reviewStatus === "APPROVED" ? session.user.id : null,
          reviewedAt: reviewStatus === "APPROVED" ? new Date() : null,
          contentVersion: { increment: 1 },
          title: data.title.trim(),
          type: data.type,
          description: data.description?.trim() || null,
          externalUrl: data.externalUrl?.trim() || null,
          publishedAt: data.publishedAt === undefined || (currentRecord.publishedAt &&
            data.publishedAt === new Date(currentRecord.publishedAt.getTime() + 7 * 3600000)
              .toISOString().slice(0, 10))
            ? currentRecord.publishedAt
            : reviewStatus === "APPROVED" ? publishedAt ?? new Date() : publishedAt,
        },
      });
    }, (tx) => tx.publication.findUnique({ where: { id } }));

    updateTag("publications");
    revalidatePath("/research");
    revalidatePath("/admin/publication");
    revalidatePath(`/admin/publication/${id}/edit`);
    return { success: true };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    return { success: false, error: "Gagal memperbarui publikasi." };
  }
}

export async function deletePublication(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const publication = await prisma.publication.findUnique({
      where: { id },
    });
    if (!publication) {
      return { success: false, error: "Publikasi tidak ditemukan." };
    }

    assertEditable(session.user, publication);
    await mutateWithMedia(
      null,
      (tx) => tx.publication.delete({
        where: { id, contentVersion: publication.contentVersion },
      }),
      (tx) => tx.publication.findUnique({ where: { id } }),
    );
    updateTag("publications");
    revalidatePath("/research");
    revalidatePath("/admin/publication");
    return { success: true };
  } catch (error) {
    if (error instanceof ContentWorkflowError) return { success: false, error: error.message };
    return { success: false, error: "Gagal menghapus publikasi." };
  }
}
