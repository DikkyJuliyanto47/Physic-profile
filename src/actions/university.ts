"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export type UniversityInput = {
  name: string;
  shortName?: string;
  slug?: string;
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
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await prisma.university.findFirst({
      where: { OR: [{ name: data.name }, { slug }] },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama atau slug kampus sudah ada.",
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

    revalidatePath("/admin/perguruan-tinggi");
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
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama kampus wajib diisi." };
    }

    const slug = data.slug?.trim() || slugify(data.name);

    const existing = await prisma.university.findFirst({
      where: {
        OR: [{ name: data.name }, { slug }],
        NOT: { id },
      },
    });

    if (existing) {
      return {
        success: false,
        error: "Nama atau slug kampus sudah ada.",
      };
    }

    await prisma.university.update({
      where: { id },
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

    revalidatePath("/admin/perguruan-tinggi");
    revalidatePath("/admin/universities");
    revalidatePath(`/admin/perguruan-tinggi/${id}/edit`);
    revalidatePath(`/admin/universities/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui kampus. Silakan coba lagi." };
  }
}

export async function deleteUniversity(id: string): Promise<ActionResponse> {
  try {
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

    revalidatePath("/admin/perguruan-tinggi");
    revalidatePath("/admin/universities");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus kampus. Silakan coba lagi." };
  }
}
