import { auth } from "@/auth";

const ALLOWED_ROLES = ["SUPER_ADMIN", "ADMIN"];

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const role = session.user.role as string | undefined;
  if (!role || !ALLOWED_ROLES.includes(role)) return null;
  return session;
}
