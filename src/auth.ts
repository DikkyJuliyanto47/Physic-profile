import { cookies } from "next/headers";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import {
  MOCK_AUTH_USER,
  hasMockAuthCookieStore,
  isMockAuthEnabled,
} from "@/lib/mock-auth";

const nextAuth = NextAuth({
  ...authConfig,
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.isActive) {
          return null;
        }

        const isPasswordValid = await compare(password, user.passwordHash);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});

export const { handlers, signIn, signOut } = nextAuth;

export async function auth() {
  const session = await nextAuth.auth();

  if (session || !isMockAuthEnabled()) {
    return session;
  }

  const cookieStore = await cookies();

  if (hasMockAuthCookieStore(cookieStore)) {
    return {
      user: { ...MOCK_AUTH_USER },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  return null;
}
