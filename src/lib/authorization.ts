import type { Session } from "next-auth";
import { MOCK_AUTH_USER } from "./mock-auth";

export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export function isAdminRole(role: unknown): role is AdminRole {
  return role === "ADMIN" || role === "SUPER_ADMIN";
}

type GuardSession = {
  user: Omit<Session["user"], "sessionVersion"> & {
    sessionVersion?: number;
  };
  expires: string;
};

type Account = {
  role: unknown;
  isActive: boolean;
  sessionVersion: number;
};

type GuardDependencies = {
  getSession: () => Promise<GuardSession | null>;
  findAccount: (id: string) => Promise<Account | null>;
  isMockEnabled: () => boolean;
};

// Isolated dependencies allow testing without requests or a live database.
export function createAuthorizationGuards(dependencies: GuardDependencies) {
  async function requireRole(superAdminOnly: boolean) {
    const session = await dependencies.getSession();
    if (!session?.user?.id) return null;

    const isMockSession =
      dependencies.isMockEnabled() &&
      session.user.id === MOCK_AUTH_USER.id &&
      session.user.sessionVersion === undefined &&
      session.user.role === MOCK_AUTH_USER.role;

    if (isMockSession) return superAdminOnly ? null : session;

    const account = await dependencies.findAccount(session.user.id);
    if (
      !account?.isActive ||
      !isAdminRole(account.role) ||
      typeof session.user.sessionVersion !== "number" ||
      session.user.sessionVersion !== account.sessionVersion ||
      (superAdminOnly && account.role !== "SUPER_ADMIN")
    ) {
      return null;
    }

    session.user.role = account.role;
    return session;
  }

  return {
    requireAdmin: () => requireRole(false),
    requireSuperAdmin: () => requireRole(true),
  };
}
