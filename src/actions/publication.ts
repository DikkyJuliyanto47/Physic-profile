"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";
import type { PublicationInput, PublicationType } from "@/types/publication";

export type ActionResponse = {
  success: boolean;
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
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "invalid" : date;
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

    await prisma.publication.create({
      data: {
        title: data.title.trim(),
        type: data.type,
        description: data.description?.trim() || null,
        externalUrl: data.externalUrl?.trim() || null,
        publishedAt,
      },
    });

    updateTag("publications");
    revalidatePath("/admin/publication");
    return { success: true };
  } catch {
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

    await prisma.publication.update({
      where: { id },
      data: {
        title: data.title.trim(),
        type: data.type,
        description: data.description?.trim() || null,
        externalUrl: data.externalUrl?.trim() || null,
        publishedAt,
      },
    });

    updateTag("publications");
    revalidatePath("/admin/publication");
    revalidatePath(`/admin/publication/${id}/edit`);
    return { success: true };
  } catch {
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

    await prisma.publication.delete({ where: { id } });
    updateTag("publications");
    revalidatePath("/admin/publication");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus publikasi." };
  }
}
