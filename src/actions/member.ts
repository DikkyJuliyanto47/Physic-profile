"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";
import { Role } from "@/generated/prisma/client";

export type MemberInput = {
  name: string;
  email: string;
  password?: string;
  role: Role;
  isActive: boolean;
  institutionId?: string;
  position?: string;
  nidn?: string;
  fieldOfExpertise?: string;
  emailPublic?: string;
  photoUrl?: string;
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
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { success: false, error: "Email wajib diisi." };
    }
    if (!data.password || data.password.length < 6) {
      return { success: false, error: "Password minimal 6 karakter." };
    }

    const existing = await prisma.user.findUnique({
      where: { email: data.email.trim() },
    });
    if (existing) {
      return { success: false, error: "Email sudah terdaftar." };
    }

    const passwordHash = await hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim(),
        passwordHash,
        role: data.role,
        isActive: data.isActive,
      },
    });

    await prisma.memberProfile.create({
      data: {
        userId: user.id,
        institutionId: data.institutionId || null,
        position: data.position?.trim() || null,
        nidn: data.nidn?.trim() || null,
        fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
        emailPublic: data.emailPublic?.trim() || null,
        photoUrl: data.photoUrl?.trim() || null,
        googleScholarUrl: data.googleScholarUrl?.trim() || null,
        scopusUrl: data.scopusUrl?.trim() || null,
        orcidUrl: data.orcidUrl?.trim() || null,
      },
    });

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
    if (!data.name || data.name.trim().length === 0) {
      return { success: false, error: "Nama wajib diisi." };
    }
    if (!data.email || data.email.trim().length === 0) {
      return { success: false, error: "Email wajib diisi." };
    }

    const existing = await prisma.user.findFirst({
      where: { email: data.email.trim(), NOT: { id } },
    });
    if (existing) {
      return { success: false, error: "Email sudah digunakan oleh akun lain." };
    }

    const updateData: Record<string, unknown> = {
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      isActive: data.isActive,
    };

    if (data.password && data.password.length > 0) {
      if (data.password.length < 6) {
        return { success: false, error: "Password minimal 6 karakter." };
      }
      updateData.passwordHash = await hash(data.password, 10);
    }

    await prisma.user.update({ where: { id }, data: updateData });

    const profile = await prisma.memberProfile.findUnique({
      where: { userId: id },
    });

    const profileData = {
      institutionId: data.institutionId || null,
      position: data.position?.trim() || null,
      nidn: data.nidn?.trim() || null,
      fieldOfExpertise: data.fieldOfExpertise?.trim() || null,
      emailPublic: data.emailPublic?.trim() || null,
      photoUrl: data.photoUrl?.trim() || null,
      googleScholarUrl: data.googleScholarUrl?.trim() || null,
      scopusUrl: data.scopusUrl?.trim() || null,
      orcidUrl: data.orcidUrl?.trim() || null,
    };

    if (profile) {
      await prisma.memberProfile.update({
        where: { userId: id },
        data: profileData,
      });
    } else {
      await prisma.memberProfile.create({
        data: { userId: id, ...profileData },
      });
    }

    revalidatePath("/admin/members");
    revalidatePath(`/admin/members/${id}/edit`);
    return { success: true };
  } catch {
    return { success: false, error: "Gagal memperbarui anggota." };
  }
}

export async function deleteMember(id: string): Promise<ActionResponse> {
  try {
    const session = await auth();
    if (session?.user?.id === id) {
      return { success: false, error: "Anda tidak dapat menghapus akun sendiri." };
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await prisma.memberProfile.deleteMany({ where: { userId: id } });
    await prisma.user.delete({ where: { id } });

    revalidatePath("/admin/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal menghapus anggota." };
  }
}

export async function toggleMemberActive(id: string): Promise<ActionResponse> {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return { success: false, error: "Anggota tidak ditemukan." };
    }

    await prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
    });

    revalidatePath("/admin/members");
    return { success: true };
  } catch {
    return { success: false, error: "Gagal mengubah status anggota." };
  }
}
