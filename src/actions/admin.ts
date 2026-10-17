"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth-utils";
import { isAdminRole, type AdminRole } from "@/lib/authorization";

export type AdminInput = {
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  password?: string;
};

export type AdminResult = {
  success: boolean;
  error?: string;
  sessionRevoked?: boolean;
};

class AdminError extends Error {}

// A single write path keeps status, role and password changes under the same guard.
export async function saveAdmin(
  id: string | null,
  input: AdminInput,
): Promise<AdminResult> {
  try {
    const session = await requireSuperAdmin();
    if (!session)
      return { success: false, error: "Akses Super Admin diperlukan." };
    if (
      id !== null &&
      (typeof id !== "string" || !id.trim() || id.length > 200)
    ) {
      throw new AdminError("ID akun tidak valid.");
    }
    if (
      !input ||
      typeof input !== "object" ||
      Array.isArray(input) ||
      typeof input.name !== "string" ||
      !input.name.trim() ||
      input.name.trim().length > 100 ||
      typeof input.email !== "string" ||
      input.email.trim().length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) ||
      !isAdminRole(input.role) ||
      typeof input.isActive !== "boolean"
    ) {
      throw new AdminError("Nama, email, role, atau status akun tidak valid.");
    }
    const password = input.password;
    if (password !== undefined && typeof password !== "string") {
      throw new AdminError("Password tidak valid.");
    }
    if (
      (!id || (password !== undefined && password !== "")) &&
      (!password ||
        password.length < 12 ||
        Buffer.byteLength(password, "utf8") > 72)
    ) {
      throw new AdminError(
        "Password minimal 12 karakter dan maksimal 72 byte.",
      );
    }
    const passwordHash = password ? await hash(password, 12) : undefined;
    const sessionRevoked = await prisma.$transaction(
      async (tx) => {
        // Recheck inside the transaction: permissions may change while hashing/waiting.
        const actor = await tx.user.findUnique({
          where: { id: session.user.id },
          select: { role: true, isActive: true, sessionVersion: true },
        });
        if (
          !actor?.isActive ||
          actor.role !== "SUPER_ADMIN" ||
          actor.sessionVersion !== session.user.sessionVersion
        ) {
          throw new AdminError("Sesi tidak lagi valid. Silakan login kembali.");
        }
        const data = {
          name: input.name.trim(),
          email: input.email.trim().toLowerCase(),
          role: input.role,
          isActive: input.isActive,
        };
        // Legacy accounts may contain mixed-case email addresses.
        const duplicate = await tx.user.findFirst({
          where: {
            email: { equals: data.email, mode: "insensitive" },
            ...(id && { id: { not: id } }),
          },
          select: { id: true },
        });
        if (duplicate)
          throw new AdminError("Email sudah digunakan oleh akun lain.");
        if (id === null) {
          await tx.user.create({
            data: { ...data, passwordHash: passwordHash! },
            select: { id: true },
          });
          return false;
        }
        const current = await tx.user.findUnique({
          where: { id },
          select: { role: true, isActive: true },
        });
        if (!current) throw new AdminError("Akun tidak ditemukan.");
        if (
          current.role === "SUPER_ADMIN" &&
          current.isActive &&
          (data.role !== "SUPER_ADMIN" || !data.isActive)
        ) {
          const remaining = await tx.user.count({
            where: { role: "SUPER_ADMIN", isActive: true },
          });
          if (remaining <= 1)
            throw new AdminError(
              "Super Admin aktif terakhir tidak boleh dinonaktifkan atau diturunkan role-nya.",
            );
        }
        const revoke =
          current.role !== data.role ||
          current.isActive !== data.isActive ||
          Boolean(passwordHash);
        await tx.user.update({
          where: { id },
          data: {
            ...data,
            ...(passwordHash && { passwordHash }),
            ...(revoke && { sessionVersion: { increment: 1 } }),
          },
          select: { id: true },
        });
        return revoke && id === session.user.id;
      },
      { isolationLevel: "Serializable" },
    );
    revalidatePath("/admin/admins");
    return { success: true, sessionRevoked };
  } catch (error) {
    if (error instanceof AdminError)
      return { success: false, error: error.message };
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? error.code
        : undefined;
    if (code === "P2002")
      return { success: false, error: "Email sudah digunakan oleh akun lain." };
    if (code === "P2034")
      return {
        success: false,
        error: "Akun berubah bersamaan. Muat ulang dan coba lagi.",
      };
    return {
      success: false,
      error: "Gagal menyimpan akun admin. Silakan coba lagi.",
    };
  }
}
