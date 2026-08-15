import type { NextAuthConfig } from "next-auth";
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
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;

        const userRole = (auth?.user?.role as string | undefined) ?? MOCK_AUTH_USER.role;
        if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
          return Response.redirect(new URL("/login", nextUrl));
        }

        return true;
      }

      if (isLoggedIn && isOnLogin) {
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
