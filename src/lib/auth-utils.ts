import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { isMockAuthEnabled, MOCK_AUTH_USER } from "@/lib/mock-auth";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return null;
  }

  // Preserve the synthetic development session; real accounts use the DB guard.
  if (
    isMockAuthEnabled() &&
    session.user.id === MOCK_AUTH_USER.id &&
    (!("sessionVersion" in session.user) || session.user.sessionVersion === undefined) &&
    session.user.role === MOCK_AUTH_USER.role
  ) {
    return session;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      id: true,
      role: true,
      isActive: true,
      sessionVersion: true,
    },
  });

  if (!user || !user.isActive) {
    return null;
  }

  if (
    !ALLOWED_ROLES.includes(user.role) ||
    (!("sessionVersion" in session.user) || session.user.sessionVersion !== user.sessionVersion)
  ) {
    return null;
  }

  session.user.role = user.role;

  return session;
}
