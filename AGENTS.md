<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Context — PSI Cabang Surabaya CMS

## Architecture
- **Next.js 16** (App Router) + Prisma ORM (PostgreSQL) + NextAuth v5
- CMS at `/admin/*` — no public/registered user accounts; only ADMIN/SUPER_ADMIN login
- Frontend is complete; backend was rebuilt from scratch (Phases 1–4 complete)

## Auth
- `src/auth.ts` — NextAuth v5 config, JWT strategy, credentials provider
- `src/auth.config.ts` — `authorized` callback with mock-auth support
- `src/middleware.ts` — NextAuth v5 middleware protecting `/admin/*` and `/login`
- `src/lib/auth-utils.ts` — `requireAdmin()` helper (checks session + ADMIN/SUPER_ADMIN role)
- Mock auth: dev-only when `NODE_ENV === "development"` AND `NEXT_PUBLIC_MOCK_AUTH === "true"`
- `AUTH_SECRET` (renamed from `NEXTAUTH_SECRET`)

## Schema (key models)
- `User` — auth only (name, email, passwordHash, role). No memberProfile relation.
- `MemberProfile` — standalone (name, email, institutionId → University, photoUrl, detailUrl, nidn, position, fieldOfExpertise, emailPublic, academic URLs)
- `ManagementPeriod` → `ManagementPosition` → `MemberProfile`
- `News`, `Event`, `Publication`, `Gallery`, `DocumentResource`, `University`, `ContactMessage`

## Conventions
- All server actions use `requireAdmin()` guard at top
- Public pages that query Prisma use `export const dynamic = "force-dynamic"`
- Dummy data files reduced to type-only exports (no hardcoded arrays)
- Input types in action files match Prisma models 1:1 (verified in Phase 3)
