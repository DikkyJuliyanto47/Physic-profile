import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createAuthorizationGuards } from "@/lib/authorization";
import { isMockAuthEnabled } from "@/lib/mock-auth";

export const { requireAdmin, requireSuperAdmin } = createAuthorizationGuards({
  getSession: auth,
  isMockEnabled: isMockAuthEnabled,
  findAccount: (id) =>
    prisma.user.findUnique({
      where: { id },
      select: {
        role: true,
        isActive: true,
        sessionVersion: true,
      },
    }),
});
