"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export type UniversityInput = {
  name: string;
  shortName?: string;
  address?: string;
  deptUrl?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createUniversity(
  data: UniversityInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const slug = slugify(data.name);
    if (!slug) {
      return { success: false, error: "Nama kampus harus mengandung huruf atau angka." };
    }

    const existing = await prisma.university.findFirst({
      where: { OR: [{ name: data.name }, { slug }] },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama kampus atau alamat yang dihasilkan sudah digunakan. Gunakan nama lain.",
      };
    }

    await prisma.university.create({
      data: {
        name: data.name.trim(),
        slug,
        shortName: data.shortName?.trim() || null,
        address: data.address?.trim() || null,
        deptUrl: data.deptUrl?.trim() || null,
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        description: data.description?.trim() || null,
      },
    });

    updateTag("universities");
    revalidatePath("/admin/universities");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat kampus. Silakan coba lagi." };
  }
}

export async function updateUniversity(
  id: string,
  data: UniversityInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const existing = await prisma.university.findFirst({
      where: {
        name: data.name,
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama kampus sudah ada. Gunakan nama lain.",
      };
    }

    await prisma.university.update({
      where: { id },
      data: {
        name: data.name.trim(),
        shortName: data.shortName?.trim() || null,
        address: data.address?.trim() || null,
        deptUrl: data.deptUrl?.trim() || null,
        websiteUrl: data.websiteUrl?.trim() || null,
        logoUrl: data.logoUrl?.trim() || null,
        description: data.description?.trim() || null,
      },
    });

    updateTag("universities");
    revalidatePath("/admin/universities");
    revalidatePath(`/admin/universities/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui kampus. Silakan coba lagi." };
  }
}

export async function deleteUniversity(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const university = await prisma.university.findUnique({
      where: { id },
      include: { _count: { select: { members: true } } },
    });

    if (!university) {
      return { success: false, error: "Kampus tidak ditemukan." };
    }

    if (university._count.members > 0) {
      return {
        success: false,
        error: `Tidak dapat menghapus kampus yang memiliki ${university._count.members} anggota terdaftar. Hapus atau pindahkan anggota terlebih dahulu.`,
      };
    }

    await prisma.university.delete({ where: { id } });

    updateTag("universities");
    revalidatePath("/admin/universities");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus kampus. Silakan coba lagi." };
  }
}
