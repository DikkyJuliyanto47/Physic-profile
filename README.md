# Physical Society of Indonesia

### Surabaya Branch

Public organizational website and authenticated content management system for PSI Surabaya, built with Next.js, PostgreSQL, and centralized content approval.

![Next.js](https://img.shields.io/badge/Next.js-16.2.12-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19.2.4-149ECA?style=flat-square&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.3.3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-7.9.1-2D3748?style=flat-square&logo=prisma&logoColor=white)
![NextAuth / Auth.js](https://img.shields.io/badge/NextAuth%20%2F%20Auth.js-5.0.0--beta.32-6B46C1?style=flat-square)

[Getting Started](#getting-started) | [Architecture](#system-architecture) | [Documentation](#technical-documentation)

## Overview

The public website presents organization profiles, scientific activities, news, events, research/publications, members, management, universities, galleries, and contact information. The admin dashboard provides content management, account administration, submission review, and media handling.

The package name is **`psi-surabaya`**. There is no public account registration. Most public content is database-backed; organizational copy, bundled assets, and the home gallery also use local frontend data. The source implements role-based authorization, approval, concurrency checks, and server-side admin pagination. Database activation and production storage are environment-dependent; source availability alone does not establish deployment readiness.

## Contents

- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Application Routes](#application-routes)
- [Frontend Architecture](#frontend-architecture)
- [Backend Architecture](#backend-architecture)
- [Authentication and Authorization](#authentication-and-authorization)
- [Content Approval Workflow](#content-approval-workflow)
- [Database and Migrations](#database-and-migrations)
- [Media Management](#media-management)
- [Environment Variables](#environment-variables)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Production Deployment](#production-deployment)
- [Technical Documentation](#technical-documentation)
- [Maintenance Notes](#maintenance-notes)
- [License](#license)

## Technology Stack

Versions are resolved from `package-lock.json`, not inferred from dependency ranges.

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.12, App Router |
| UI | React / React DOM 19.2.4 |
| Language | TypeScript 5.9.3, strict checking |
| Styling | Tailwind CSS 4.3.3 through @tailwindcss/postcss |
| Database | PostgreSQL; local Compose uses postgres:16-alpine |
| ORM | Prisma 7.9.1 and @prisma/adapter-pg |
| Authentication | NextAuth 5.0.0-beta.32 / Auth.js, credentials and JWT |
| Passwords / HTML | bcryptjs / sanitize-html |
| Presentation | next/image, framer-motion, Lucide, React Icons, Font Awesome |
| Linting | ESLint 9.39.5 and eslint-config-next |
| Package manager | npm; lockfile version 3 |

## System Architecture

Frontend and backend run in one Next.js application. Server Components are the default; Client Components handle browser interaction.

```text
Browser -> App Router -> Server Components -> cached readers / Prisma -> PostgreSQL
Browser -> Client Components -> Server Actions -> guards / validation
                                                -> approval transaction -> Prisma
Browser -> Route Handlers -> Auth.js or managed filesystem uploads
```

`src/lib/data.ts` supplies cached public readers, presentation mapping, date formatting, and sanitized News/Event rich text. It uses domain cache tags and cacheLife("hours"); `next.config.ts` enables Cache Components. Some home sections query Prisma directly. Content mutations update domain tags and revalidate the layout.

| Content/asset source | Usage |
|---|---|
| PostgreSQL canonical records | Public news/events, directories, management, gallery, publications |
| Static frontend data | Home GallerySection reads three galleryItems from src/components/features/home/data.ts |
| public/assets/ | Bundled images and logos |
| public/uploads/news/ | Runtime uploads from several admin forms; existing URL prefix retained |

The home carousel is independent of database gallery edits and uploaded media.

## Project Structure

```text
.
|-- docs/
|   |-- frontend/             Routes, components, rendering, design system
|   |-- backend/              Server architecture, authentication, workflow
|   '-- database/             Models, relations, migration notes
|-- prisma/                   Schema, migration SQL, seed
|-- public/
|   |-- assets/               Bundled static assets
|   '-- uploads/news/         Runtime media
|-- src/
|   |-- app/                  Layouts, pages, metadata, API routes
|   |-- actions/              Content, review, account Server Actions
|   |-- components/
|   |   |-- admin/            Forms, mutation controls, queue, feedback
|   |   |-- features/         Domain-specific public/dashboard components
|   |   |-- forms/            Shared form exports
|   |   |-- layout/           Public/admin navigation and layout
|   |   |-- seo/              Structured-data components
|   |   '-- ui/               Presentation primitives
|   |-- config/               Site, navigation, SEO configuration
|   |-- generated/prisma/     Generated Prisma client
|   |-- lib/                  Data, guards, approval, media, client hooks
|   |-- hooks/                Minimal hook exports
|   |-- server/               Server/database entry-point exports
|   |-- types/                Shared types
|   '-- utils/                Utilities such as cn
|-- docker-compose.yml        Local PostgreSQL service
|-- next.config.ts            Cache and image configuration
|-- prisma.config.ts          Schema, migration, seed, datasource configuration
'-- package.json              Metadata, scripts, dependencies
```

Private runtime metadata in `.media-lifecycle/` must persist alongside public uploads.

## Application Routes

### Public website

| Route | Purpose |
|---|---|
| / | Landing page: static gallery, organization, statistics, news, events, universities, join CTA |
| /about | Organization profile |
| /news, /news/[slug] | Published news and details |
| /events, /events/[slug] | Published events and details |
| /research | Research and publications |
| /gallery | Database-backed gallery |
| /members | Member directory |
| /managements | Management information |
| /universities, /universities/[slug] | University directory and details |
| /contact | Contact information |

### Authentication and administration

| Route | Purpose |
|---|---|
| /login | Credentials login; optional development mock-auth path |
| /forgot-password, /reset-password | Presentation pages; no email/token recovery backend is established by these pages |
| /admin | Protected overview |
| /admin/news, /admin/events, /admin/members | Content listings |
| /admin/universities, /admin/publication, /admin/gallery | Content listings |
| Listing routes above + /new or /[id]/edit | Create/edit forms |
| /admin/managements, /admin/managements/create, /admin/managements/[id]/edit | Period/position management; positionId selects an existing position |
| /admin/submissions | Owned proposals |
| /admin/review | Content review by Admin PSI Surabaya |
| /admin/admins | Account management by Admin PSI Surabaya |

### API endpoints

| Method and route | Purpose |
|---|---|
| GET/POST /api/auth/[...nextauth] | Auth.js session, CSRF, signin, signout and related actions |
| POST /api/upload | Validated multipart upload; returns { url } |
| DELETE /api/upload | Owner-checked upload release signal |
| POST /api/upload/cleanup | Authenticated maintenance cleanup |

## Frontend Architecture

The root layout supplies global CSS, font loading, and metadata. The public layout composes PublicNavbar, PublicMobileNav through navigation, and PublicFooter. The dashboard layout guards access and renders AdminLayoutClient with SessionProvider, AdminSidebar, and AdminTopbar. Overview also guards its own queries.

Public features live in `src/components/features/`. Home exports include GallerySection, AboutSection, StatisticsSection, LatestNewsPanel, EventsSection, UniversitiesSection, and JoinCtaSection. UI primitives include Container, Section, SectionHeading, PageHeader, Card, Button, Badge, and PersonCard. Tailwind tokens and admin focus indicators live in `src/app/globals.css`.

CMS Client Components receive server-loaded data and expected-version tokens. Forms provide input validation, upload tracking, loading, and inline errors; server validation remains authoritative. Successful navigation uses the result query parameter and ContentFeedback for saved/submitted/deleted/approved/rejected/resubmitted/status-updated messages. Review feedback is outside queue items that can disappear after processing.

Admin listings use take/skip pagination, page size 20, filtered counts, and id tie-breakers. Search/filter and ownership remain in server queries. AdminPagination shows only previous/next controls and is hidden for one page. Period/position lists have separate page parameters; the review queue has its own navigation.

Member/University delete and Gallery preview/delete use native modal dialogs through `use-dialog-accessibility.ts`: initial focus, inert background, Escape handling, and focus restoration. Other confirmations remain inline implementations. Sensitive account changes and approval of deletion require confirmation; period deletion identifies cascading position removal. Dialog behavior is not assumed identical across all components.

## Backend Architecture

Server Actions in `src/actions/` delegate content operations to shared helpers.

| Source | Responsibility |
|---|---|
| src/lib/content-approval.ts | Guards, ownership, version checks, transactions, responses, cache invalidation |
| src/lib/content-fields.ts | Field normalization and domain validation |
| src/lib/content-workflow.ts | Editable-state, version, review transition rules |
| src/lib/content-records.ts | Canonical snapshots and model-specific mutations |
| src/actions/admin.ts | Account validation, mutation, session revocation |
| src/lib/media-lifecycle.ts | Storage coordination and cleanup |

The flow is guard -> approval readiness -> transactional actor/ownership/version checks -> normalization -> proposal/canonical mutation -> commit -> cleanup -> cache invalidation -> response. Content transactions use Serializable isolation and recheck active state, role, and sessionVersion inside the transaction.

Results distinguish success, error, pending, and requestId where applicable. Known Prisma errors map to unavailable approval storage, unique/reference conflicts, missing records, or concurrency conflicts. Covered client mutation handlers distinguish business/version errors from rejected or malformed transport responses. Unknown outcomes require inspection before manual retry; those handlers do not automatically repeat mutations.

## Authentication and Authorization

`src/auth.ts` defines the existing NextAuth instance with credentials and JWT sessions lasting up to eight hours. Login reads User, rejects inactive accounts, and verifies the password with bcrypt. The catch-all auth route exports its GET/POST handlers. Client logout calls signOut and returns to /login; CSRF protection remains enabled.

`src/lib/auth-utils.ts` and `authorization.ts` compare sessions with the current database account: valid role, isActive, and sessionVersion. JWT middleware/proxy checks do not replace these guards. The repository contains src/middleware.ts and root proxy.ts; Next.js discovery determines which runs, so their presence does not establish simultaneous execution.

| Internal role | Display label | Scope |
|---|---|---|
| SUPER_ADMIN | Admin PSI Surabaya | Accounts, review, all content, direct content mutation |
| ADMIN | Admin | Owned content through submissions and own proposal queue |

Identity remains dynamic User.name, separate from role labels. Existing JWTs retain the name received at login; renamed accounts may need logout/login to refresh display identity. Role/status/password changes increment sessionVersion. The UI signs out if the current account's session is revoked. Name/email changes do not increment it. The final active SUPER_ADMIN cannot be deactivated or demoted.

Mock auth requires NODE_ENV=development and NEXT_PUBLIC_MOCK_AUTH=true. It uses the existing mock cookie, is disabled outside development, and does not satisfy requireSuperAdmin.

### Ownership

ContentChange.authorId is the central ownership source. SQL filters allowed target ids before listing. News/Event authorId is a legacy fallback only without a central record. Other unassigned legacy data remains manageable by Admin PSI Surabaya; ownership is not inferred from member email or university affiliation. Mutation helpers recheck ownership transactionally.

## Content Approval Workflow

ContentChange stores one mutable proposal/ownership record per kind/targetId, not an append-only audit log. Fields include operation, owner, submitter, payload, before snapshot, baseHash, review metadata, and contentVersion.

1. **Submit:** Admin CREATE stores PENDING_REVIEW without a public row. UPDATE/DELETE and status proposals leave canonical content unchanged while pending.
2. **Approve:** Admin PSI Surabaya verifies proposal version and canonical hash, applies the mutation, records APPROVED/reviewer/time, and clears payload/before.
3. **Reject:** A reason is required; status becomes REVISION_REQUIRED. The proposal remains available for correction; canonical content is unchanged.
4. **Resubmit:** An authorized editor revises an open proposal after version/hash checks; it returns to PENDING_REVIEW with review metadata reset.
5. **Direct administration:** Admin PSI Surabaya can mutate canonical content through the shared path, retaining existing ownership and recording APPROVED metadata.

News/Event public readers require PUBLISHED. Publication requires a non-null publishedAt no later than now. Approval and public visibility are separate concerns.

### Optimistic concurrency control

Existing-content mutations carry the token rendered with the form/row: canonical fingerprint plus the observed proposal version, or null when absent. Forms retain the initial token. News uses contentVersion; other models use updatedAt or scalar snapshots, with periods including positions. Review/resubmit also compare canonical baseHash. Checks and writes are atomic in Serializable transactions; proposal updates constrain contentVersion. Conflicts reject stale writes.

Tokens protect target/proposal state, not every related record or external writer. Full scalar period-position snapshots and version metadata remain necessary even when display joins are paginated. The runtime blocks content writes if central approval storage is missing or legacy News.pendingRevision snapshots remain.

## Database and Migrations

The shared PrismaClient uses PrismaPg; the generator writes to `src/generated/prisma`. Schema and CLI paths are configured in `prisma.config.ts`.

| Model | Purpose |
|---|---|
| User | Administrator identity, password hash, role, active state, sessionVersion |
| News / Event | Authored content and publication state; News retains legacy review fields |
| Publication | Type, external/file links, publication date |
| MemberProfile / University | Standalone members and optional institutional affiliation |
| ManagementPeriod / ManagementPosition | Periods, active state, positions, optional member assignments |
| Gallery | Media URLs, type, category, order, featured state |
| ContentChange | Central ownership and versioned proposals |

User is not directly linked to MemberProfile. ContentChange.targetId is polymorphic, without foreign keys to each content table; the application validates targets. Period deletion cascades to positions; member deletion clears optional position assignments. The schema allows institution links to become null on university deletion, but application logic refuses deletion while members remain. Review/ownership references to User restrict deletion. Transactions, unique constraints, foreign keys, and application checks jointly enforce integrity.

### Migration evidence

Available migrations are baseline, final-verification (empty), admin-session-version, news-event-date, and central-content-approval. Obsolete legacy approval folders are absent. Central SQL creates approval enums, News metadata, and ContentChange, deliberately rejecting existing/partial approval objects and unresolved history.

The documented read-only inspection on **16 October 2026** found central marked complete with applied_steps_count 0 and a matching checksum; ContentChange/News approval fields existed. This does not establish how SQL was initially applied or prove activation in every environment. No live database inspection was performed for this README update.

That inspection also found 20260928000000_normalize_image_urls in database history without its SQL file in the repository. History is not established as fully synchronized. Central comments still reference legacy migrations and an absent activation document; they are not instructions to provision duplicate objects or rerun central SQL. Review the environment's actual history before applying pending migrations. See [migration documentation](docs/database/migrations.md).

## Media Management

### Upload validation and storage

POST /api/upload requires an admin session and a non-empty PNG, JPEG, or WebP image up to **1 MiB**. MIME type, extension, filename, and byte signature are validated. Directories are created as needed; UUID filenames retain the /uploads/news/ URL prefix, including uploads from forms other than news. The response remains { url }. Write failures return HTTP 500 without a success URL and are logged. No external storage service is used.

Images use next/image, with unoptimized rendering where specified. Remote optimization is allowlisted only for https://img.youtube.com/vi/** in next.config.ts. Bundled assets and runtime uploads have different deployment requirements.

### Reference tracking, cleanup, and locks

- **Ownership:** only canonical UUID-v4 upload files with valid application metadata are physical deletion candidates. Unknown legacy files, static assets, symlinks/hardlinks, and paths outside validated directories are not adopted. External URLs are not physical deletion targets.
- **References:** checks read media-bearing URL/rich-text columns on News, Event, MemberProfile, University, Publication, and Gallery, plus News.pendingRevision and ContentChange.payload/before. They no longer serialize every field of every model. A matching UUID in those columns, including absolute URLs or common encoded references, conservatively retains the file. Ambiguous decoding or missing approval storage retains media. The current schema has no DocumentResource or ContactMessage model.
- **Commit boundary:** mutateWithMedia captures previous references, commits the mutation, marks candidates released, then checks references before unlink. Cleanup errors never turn a committed save into a retryable mutation failure. Candidates are recorded for later maintenance when metadata remains writable.
- **Release signals:** upload forms track newly created URLs, not initial or pasted media. Unmount/page exit sends owner-checked DELETE signals, at most 50 URLs per request. Pages retained in the back/forward cache are not released. Release does not delete files.
- **Retention:** released uploads become eligible after 24 hours and still require reference checks. Active/unreleased uploads do not expire automatically. Lost responses, failed releases, partial writes, and failed metadata registration may leave retained files. Unknown ownership is never guessed.
- **Maintenance:** cleanup runs opportunistically after uploads and via authenticated POST /api/upload/cleanup. Responses report enabled, deleted, retained, and failed; failures return 500, while disabled cleanup with retained candidates returns 503. No scheduler or durable background worker is installed.
- **Coordination:** a filesystem mkdir lock spans mutation/commit/cleanup; PostgreSQL advisory transaction locks coordinate reference changes/checks. Incoming managed URLs must exist, and tombstones reject later saves of deleted media. Only lock acquisition waits, up to five seconds; mutations are not automatically retried.
- **Crash behavior:** a stale .media-lifecycle/lock deliberately blocks later lifecycle operations. There is no automatic takeover. Remove that empty lock only after confirming all relevant writers and cleanup processes have stopped. Query/lock failures preserve files.

Cleanup is synchronous within the storage lock and still scans all rows in relevant columns. Its cost grows with those tables. Physical deletion is active in development. Production requires MEDIA_SHARED_STORAGE=true to affirm a persistent namespace shared by every instance for both uploads and metadata, with every reference writer using the helper. Mixed-version writers, imports, direct SQL, independent disks, or external storage changes invalidate this guarantee.

## Environment Variables

Use .env.example as the template and keep real credentials out of version control. MEDIA_SHARED_STORAGE is consumed by source even though it is absent from the template.

| Variable | Use |
|---|---|
| DATABASE_URL | Required PostgreSQL connection for Prisma, CLI configuration, and seed |
| AUTH_SECRET | Required Auth.js secret |
| NEXT_PUBLIC_SITE_URL | Optional public HTTPS origin for absolute metadata, robots, and sitemap; localhost/IP/example domains, credentials, ports, and path/query/hash values are rejected; absolute URL output is limited when omitted/invalid |
| NEXT_PUBLIC_MOCK_AUTH | Optional development-only mock auth, ignored outside development |
| MEDIA_SHARED_STORAGE | true enables physical cleanup outside development, subject to the storage/writer contract above |
| ADMIN_EMAIL, ADMIN_PASSWORD | Seed inputs; not normal credentials-login configuration |
| NODE_ENV | Runtime mode controlling mock auth, client reuse, and cleanup defaults |

Project configuration does not explicitly require/read NEXTAUTH_URL. Auth.js may additionally interpret its standard deployment environment conventions; this table lists variables directly consumed by project source.

## Getting Started

### Prerequisites

- Node.js matching Prisma's declared engines: **^20.19, ^22.12, or >=24.0**, and npm. Next.js alone declares >=20.9.0, but Prisma imposes the stricter requirement.
- PostgreSQL with a compatible schema and reviewed migration history.
- Writable upload/metadata directories for media operations.

### Install and configure

From a checkout of this repository:

```bash
npm ci
```

Copy the environment template using the command for your shell:

```powershell
Copy-Item .env.example .env
```

```bash
cp .env.example .env
```

Configure database connectivity and AUTH_SECRET locally or through the deployment environment. No real connection string/password is provided here. Prisma CLI loads dotenv through prisma.config.ts; application-only .env.local values do not automatically configure its datasource.

For an optional **local development database**, Compose provides PostgreSQL 16:

```bash
docker compose up -d postgres
```

This starts a local database service; skip it when using an existing database. Compose's bundled development credentials are not production configuration. Starting PostgreSQL does not apply the application schema.

### Database and development startup

Inspect existing migration history before applying SQL, particularly the approval/history conditions under [Database and Migrations](#database-and-migrations). There is no unconditional reset/migration sequence for an existing database in this README.

After confirming schema compatibility, generate the client and start development:

```bash
npx prisma generate
npm run dev
```

Open http://localhost:3000 and use an existing active admin account. The configured seed reads ADMIN_EMAIL/ADMIN_PASSWORD, creates an initial SUPER_ADMIN if absent, and can change an existing account's password/sessionVersion if the password differs. It is not a required startup step or a rename mechanism; the commands above do not run it.

## Available Scripts

| Command | Actual script |
|---|---|
| npm run dev | next dev |
| npm run build | prisma generate && next build |
| npm run start | next start |
| npm run lint | eslint |

The installed Prisma CLI also provides generation, schema validation/inspection, Studio, and migration management. These are separate operations, not additional npm scripts. Build generates the client; it does not migrate or seed the database.

## Production Deployment

The repository contains no provider-specific deployment or CI/CD setup. Build and run with:

```bash
npm run build
npm run start
```

The environment must supply PostgreSQL connectivity, compatible migration state, authentication configuration, and persistent writable media storage. Compose runs only PostgreSQL; its postgres_data volume does not store uploads. Source/static review does not prove production readiness.

### Storage, serving, and recovery

1. Persist public/uploads/news and .media-lifecycle together across restarts, redeployments, and release-directory changes. Ephemeral/serverless storage or a read-only application directory does not satisfy this filesystem implementation.
2. Every writer and media reader must see the same uploads and lifecycle metadata. Storage must remain application-controlled and must not be renamed/modified externally during operations. No object-storage integration is implemented.
3. The runtime user needs create/write permissions for both directories; the serving process needs read access to uploads. A completed upload proves a write, not HTTP availability. Hosting must serve runtime-created /uploads/news/* URLs from the durable directory. Next.js discovery of post-startup public files must be verified for that environment; no custom serving route is supplied.
4. Coordinate PostgreSQL, media, and metadata/tombstone backups and recovery points. A database-only backup cannot recover images. Restore original filenames, paths, and permissions. Metadata loss prevents ownership-based cleanup and must not be repaired by guessing. Backup frequency, retention, and restore execution are infrastructure responsibilities not supplied by this repository.

### Deployment verification boundary

Persistence, permissions, runtime serving, multi-instance visibility, and coordinated recovery were not verified during this documentation update. Checks in the target hosting environment include:

- Confirm working directory, mounts, permissions, and URL mappings on every instance.
- Upload after startup; verify the direct URL, next/image rendering, and an existing image.
- Repeat access after restart/redeploy and across instances.
- In isolated staging, verify unwritable storage returns HTTP 500 without a success URL and logs the error, then restore permissions.
- Restore a coordinated database/media/metadata backup in an isolated environment; verify existing URLs and a subsequent upload.

## Technical Documentation

Detailed technical documentation is written in Indonesian.

| Area | Documents |
|---|---|
| Frontend | [Overview](docs/frontend/readme.md), [architecture](docs/frontend/architecture.md), [routing](docs/frontend/routing.md), [components](docs/frontend/component-architecture.md), [design system](docs/frontend/design-system.md), [UI patterns](docs/frontend/development-guidelines.md) |
| Backend | [Architecture](docs/backend/README.md), [authentication and workflow](docs/backend/auth_and_workflow.md) |
| Database | [Models and integrity](docs/database/README.md), [migration evidence](docs/database/migrations.md) |

## Maintenance Notes

- Home gallery items remain in src/components/features/home/data.ts; database gallery changes do not replace the carousel.
- Cached readers, presentation mapping, and HTML sanitization live in src/lib/data.ts. Mutation helpers invalidate corresponding tags.
- Schema, SQL migrations, database history, and seed have different responsibilities; schema.prisma alone does not prove deployment state.
- User.name is identity data; role labels are display text. A new login refreshes the JWT name after account renaming.
- next.config.ts owns the remote image allowlist. src/config/seo.ts and App Router metadata files own site-origin, robots, sitemap, and structured metadata behavior.
- Version metadata, owned-id scopes, option lists, and full scalar position snapshots can grow independently of paginated display rows.
- A development auth 404 does not imply a second auth instance is needed. The existing catch-all exports handlers; verify route discovery and restart a stale dev server before changing authentication configuration.

## License

No license file or explicit licensing terms are specified in this repository. No license is inferred from the project name or dependency licenses.
