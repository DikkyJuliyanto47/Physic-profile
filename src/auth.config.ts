import type { NextAuthConfig } from "next-auth";
import { isAdminRole } from "@/lib/authorization";
import {
  MOCK_AUTH_COOKIE_NAME,
  MOCK_AUTH_USER,
  getMockAuthCookieValue,
  isMockAuthEnabled,
} from "@/lib/mock-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") session.user.id = token.id;
        session.user.role = isAdminRole(token.role) ? token.role : "";
        if (typeof token.sessionVersion === "number") {
          session.user.sessionVersion = token.sessionVersion;
        }
      }
      return session;
    },
    authorized({ auth, request }) {
      const nextUrl = request.nextUrl;
      const cookieHeader = request.headers.get("cookie") ?? undefined;
      const mockCookieValue =
        request.cookies?.get?.(MOCK_AUTH_COOKIE_NAME)?.value ??
        getMockAuthCookieValue(cookieHeader) ??
        "";
      const isMockAuthenticated =
        isMockAuthEnabled() && mockCookieValue === "true";
      const isLoggedIn = !!auth?.user || isMockAuthenticated;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;

        const userRole = auth?.user
          ? auth.user.role
          : isMockAuthenticated
            ? MOCK_AUTH_USER.role
            : undefined;
        if (!isAdminRole(userRole)) {
          return Response.redirect(new URL("/login", nextUrl));
        }

        return true;
      }

      // A JWT may still exist after requireAdmin() revokes access.
      // Keep login reachable so the user can obtain a fresh session.
      return true;
    },
  },
} satisfies NextAuthConfig;
