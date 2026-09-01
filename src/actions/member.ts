"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-utils";
import { revalidatePath, updateTag } from "next/cache";

export type MemberInput = {
  name: string;
  email: string;
  institutionId?: string;
  fieldOfExpertise?: string;
  photoUrl?: string;
  detailUrl?: string;
  nidn?: string;
  position?: string;
  emailPublic?: string;
  googleScholarUrl?: string;
  scopusUrl?: string;
  orcidUrl?: string;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
};

export async function createMember(data: MemberInput): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.memberProfile.findUnique({
      where: { email: data.email.trim() },
    });
    if (existing) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    await prisma.memberProfile.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        institutionId: data.institutionId || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
        detailUrl: data.detailUrl?.trim() || null,
        nidn: data.nidn?.trim() || null,
        position: data.position?.trim() || null,
        emailPublic: data.emailPublic?.trim() || null,
        googleScholarUrl: data.googleScholarUrl?.trim() || null,
        scopusUrl: data.scopusUrl?.trim() || null,
        orcidUrl: data.orcidUrl?.trim() || null,
      },
    });

    updateTag("members");
    revalidatePath("/admin/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal membuat anggota. Silakan coba lagi." };
  }
}

export async function updateMember(
  id: string,
  data: MemberInput
): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.memberProfile.findFirst({
      where: { email: data.email.trim(), NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Email sudah digunakan oleh anggota lain." };
    }

    await prisma.memberProfile.update({
      where: { id },
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        institutionId: data.institutionId || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
        detailUrl: data.detailUrl?.trim() || null,
        nidn: data.nidn?.trim() || null,
        position: data.position?.trim() || null,
        emailPublic: data.emailPublic?.trim() || null,
        googleScholarUrl: data.googleScholarUrl?.trim() || null,
        scopusUrl: data.scopusUrl?.trim() || null,
        orcidUrl: data.orcidUrl?.trim() || null,
      },
    });

    updateTag("members");
    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui anggota." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse> {
  try {
    const session = await requireAdmin();
    if (!session) {
      return { success: false, error: "Unauthorized. Silakan login." };
    }

    const member = await prisma.memberProfile.findUnique({ where: { id } });
    if (!member) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await prisma.memberProfile.delete({ where: { id } });

    updateTag("members");
    revalidatePath("/admin/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus anggota." };
  }
}
