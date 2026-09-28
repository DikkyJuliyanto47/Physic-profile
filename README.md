# Physical Society of Indonesia - Surabaya Branch

This repository contains the web application for the Physical Society of Indonesia (PSI) Surabaya Branch. It provides public organizational information and an authenticated administration area for managing content stored in PostgreSQL.

## Overview

The public application includes a landing page, organization/about information, events, news, research and publications, gallery content, member and management information, university information, and contact information. Public listings and detail pages read content from the database where implemented.

The `/admin` area provides authenticated CRUD screens for managing news, events, members, management periods and positions, universities, publications, and gallery items. Authentication uses NextAuth credentials with a Prisma-backed user record. A development-only mock-auth path is controlled by `NEXT_PUBLIC_MOCK_AUTH`.

## Tech Stack

Versions below are taken from `package.json` and `package-lock.json`:

- Next.js `16.2.12` with the App Router
- React `19.2.4` and React DOM `19.2.4`
- TypeScript `5.x` with strict checking enabled
- Tailwind CSS `4.x` through `@tailwindcss/postcss`
- Prisma `7.9.1` with PostgreSQL and `@prisma/adapter-pg`
- NextAuth `5.0.0-beta.32` for credentials authentication and JWT sessions
- ESLint `9.x` with `eslint-config-next` rules
- `next/image` for image rendering and `framer-motion` for animation
- `lucide-react`, `react-icons`, and Font Awesome packages for icons
- npm, identified by `package-lock.json` (`lockfileVersion: 3`)

## Application Architecture

```text
Browser
  -> Next.js App Router route
  -> server/client page and feature components
  -> server actions or cached data helpers
  -> Prisma Client with PostgreSQL

Browser
  -> /api/auth/[...nextauth] or /api/upload
  -> Next.js route handler
  -> authentication or local file-system operation
```

The application uses Server Components by default. Client Components are used for browser interaction such as the home gallery carousel and admin forms. `src/lib/data.ts` contains cached server-side readers for published news, events, members, management, gallery, and universities. The home page also queries published events and universities directly with Prisma.

There are three distinct content and asset paths:

- **Database-backed content:** public news, events, members, management, gallery, and university pages use Prisma data readers. Publication data is used by the research/publication area and admin screens.
- **Static frontend content:** the home page's `GallerySection` imports local `galleryItems` from `src/components/features/home/data.ts`.
- **Static assets:** files under `public/assets` are served directly by Next.js.
- **Uploaded assets:** `POST /api/upload` writes uploaded files to `public/uploads/news` and returns a URL such as `/uploads/news/<filename>`.

## Project Structure

```text
.
├── docs/frontend/              Frontend architecture and design documentation
├── prisma/                     Schema, migrations, and seed script
├── public/
│   ├── assets/                 Bundled logos, hero, gallery, news, and other images
│   └── uploads/news/           Files written by the upload route
├── src/
│   ├── app/                    App Router layouts, pages, metadata, and API routes
│   ├── actions/                Server actions for admin content mutations
│   ├── components/
│   │   ├── admin/              Reusable admin forms
│   │   ├── features/           Feature-level public and dashboard components
│   │   ├── forms/              Shared form exports
│   │   ├── layout/             Public and admin navigation/layout components
│   │   └── ui/                 Reusable UI primitives
│   ├── config/                 Site configuration
│   ├── generated/prisma/       Generated Prisma client output
│   ├── hooks/                  Hook exports (currently minimal)
│   ├── lib/                    Prisma, auth, mock-auth, and data helpers
│   ├── server/                 Server entry points and database exports
│   ├── types/                  Shared TypeScript types
│   └── utils/                  Small utilities such as `cn`
├── docker-compose.yml          Local PostgreSQL 16 service
├── next.config.ts              Next.js image and cache configuration
├── prisma.config.ts            Prisma schema, migration, and seed configuration
└── package.json                Dependencies and npm scripts
```

## Pages and Routes

### Public routes

| Route | Purpose |
|---|---|
| `/` | Landing page with the static gallery, about, statistics, latest news, events, universities, and join CTA sections |
| `/about` | Organization/about information |
| `/events` and `/events/[slug]` | Published event listing and event details |
| `/gallery` | Database-backed gallery listing |
| `/managements` | Active management information |
| `/members` | Member directory |
| `/news` and `/news/[slug]` | Published news listing and news details |
| `/research` | Research and publication content |
| `/universities` and `/universities/[slug]` | University listing and details |
| `/contact` | Contact information |

### Authentication and administration routes

`/login`, `/forgot-password`, and `/reset-password` provide authentication-related pages. `/admin` is protected and contains dashboard, news, events, members, managements, universities, publication, and gallery management screens, including their create and edit routes where present.

### API routes

- `GET`/`POST` `/api/auth/[...nextauth]` exposes the NextAuth handlers.
- `POST` `/api/upload` accepts a multipart form file and writes it under `public/uploads/news`.

## Main Components

Public layout components include `PublicNavbar`, `PublicMobileNav`, and `PublicFooter`. Home feature components are exported from `src/components/features/home/index.ts`, including `GallerySection`, `AboutSection`, `StatisticsSection`, `LatestNewsPanel`, `EventsSection`, `UniversitiesSection`, and `JoinCtaSection`.

Feature folders also contain the news, events, gallery, management, members, research, universities, about, contact, and dashboard components. Shared presentation primitives such as `Container`, `Section`, `PageHeader`, `Card`, `Button`, `ScrollReveal`, and `PersonCard` are in `src/components/ui`.

## Data Flow

Static home gallery:

```text
GallerySection
  -> galleryItems in src/components/features/home/data.ts
  -> /public/assets/gallery/*
  -> next/image
```

This carousel is intentionally not connected to the gallery database reader, news responses, or `/uploads/news`.

Dynamic public content:

```text
Public page or feature
  -> src/lib/data.ts cached reader, or direct Prisma query on the home page
  -> Prisma Client
  -> PostgreSQL
  -> mapped data
  -> UI
```

Admin mutations are implemented as server actions in `src/actions`, protected by `requireAdmin()` and the admin layout/middleware. Credentials are checked against the Prisma `User` model using `bcryptjs`.

## Image Handling

- Local images in `public/assets` and `public/uploads/news` can be referenced by root-relative URLs.
- Components use Next.js `Image` (`next/image`) for rendered images.
- `next.config.ts` permits remote images only from `https://img.youtube.com/vi/**`.
- The home `GallerySection` uses the three local images defined in `src/components/features/home/data.ts`.
- The upload route creates `public/uploads/news` when needed and returns a root-relative URL. It does not upload to a separate storage service.

## Environment Variables

Copy `.env.example` to `.env` and replace the placeholders. Do not commit real credentials.

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma and the seed script |
| `AUTH_SECRET` | Yes | Secret used by NextAuth |
| `NEXT_PUBLIC_SITE_URL` | No | Base URL for metadata, robots, and sitemap; the application has a fallback when omitted |
| `NEXT_PUBLIC_MOCK_AUTH` | No | Set to `true` only for the development mock-auth path; it is ignored outside development |
| `ADMIN_EMAIL` | For seeding | Admin email read by `prisma/seed.ts` |
| `ADMIN_PASSWORD` | For seeding | Admin password read by `prisma/seed.ts` |
| `NODE_ENV` | Set by runtime | Used to distinguish development mock auth and Prisma client behavior |

`NEXTAUTH_URL` is not required by the current source and is intentionally not listed.

## Getting Started

### Prerequisites

- Node.js and npm compatible with Next.js `16.2.12` (use a current Node.js LTS release).
- PostgreSQL accessible through `DATABASE_URL`. The included Docker Compose file provides PostgreSQL 16 for local development.

### Installation

```bash
git clone https://github.com/DikkyJuliyanto47/Physic-profile.git
cd Physic-profile
npm install
```

Create the environment file:

```bash
copy .env.example .env
```

On shells that support `cp`, the equivalent is `cp .env.example .env`.

To start the local database with Docker Compose:

```bash
docker compose up -d postgres
```

Set `DATABASE_URL` to match the PostgreSQL service, for example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
```

Apply migrations and optionally seed an admin user using the Prisma CLI. The seed reads `ADMIN_EMAIL` and `ADMIN_PASSWORD`.

### Development

```bash
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm run start
```

`npm run build` generates the Prisma client before building the Next.js application.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Generate Prisma Client and create a production Next.js build |
| `npm run start` | Start the production Next.js server |
| `npm run lint` | Run ESLint |

Additional database operations are available through the installed Prisma CLI, including `npx prisma migrate dev`, `npx prisma studio`, and `npx prisma generate`.

## Development Guidelines

- Keep application code in TypeScript and preserve the strict compiler configuration.
- Follow the App Router structure in `src/app`; use Server Components unless client-side interaction requires a Client Component.
- Keep feature-specific UI in `src/components/features` and shared primitives in `src/components/ui`.
- Use `src/lib/prisma.ts` for the shared Prisma client and `src/lib/data.ts` for cached public data readers.
- Keep admin mutations behind the existing `requireAdmin()` guard and authentication middleware.
- Place bundled static images in `public/assets`; treat uploaded content as URLs returned by the upload route.

## Deployment

The repository contains no provider-specific deployment or CI/CD configuration. A production deployment must provide the required environment variables and PostgreSQL database, then run:

```bash
npm run build
npm run start
```

`docker-compose.yml` is a local PostgreSQL setup, not an application deployment configuration.

## Maintenance Notes

- Home landing-page content and its static gallery items are maintained in `src/components/features/home`.
- Database-backed public readers and response mapping are maintained in `src/lib/data.ts`.
- Prisma schema, migrations, and seed behavior are under `prisma/`.
- Site metadata, robots, and sitemap use `NEXT_PUBLIC_SITE_URL` with an application fallback.
- The remote image allowlist is maintained in `next.config.ts`.

## License

No license file or licensing information is specified in this repository.
