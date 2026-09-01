import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

const nextAuth = NextAuth(authConfig);

export default nextAuth.auth;

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
