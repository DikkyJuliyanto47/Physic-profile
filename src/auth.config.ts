import type { NextAuthConfig } from "next-auth";
import { Role } from "@/generated/prisma/client";

export default {
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");
      const isOnLogin = nextUrl.pathname.startsWith("/login");

      if (isOnAdmin) {
        if (!isLoggedIn) return false;

        const userRole = auth?.user?.role;
        if (userRole !== Role.SUPER_ADMIN && userRole !== Role.ADMIN) {
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
