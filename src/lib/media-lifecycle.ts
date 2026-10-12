import "server-only";

import { randomUUID } from "node:crypto";
import { lstat, mkdir, readFile, readdir, rmdir, unlink, writeFile } from "node:fs/promises";
import { setTimeout } from "node:timers/promises";
import path from "node:path";
import { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const PREFIX = "/uploads/news/";
const FILE_NAME = /^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}\.(png|jpe?g|webp)$/;
const RELEASE_TTL = 24 * 60 * 60 * 1000;

// Media and ownership metadata are runtime storage, not build dependencies.
const metadataDir = path.join(/* turbopackIgnore: true */ process.cwd(), ".media-lifecycle");
const uploadDir = path.join(/* turbopackIgnore: true */ process.cwd(), "public", "uploads", "news");

type Metadata = {
  owner: string;
  releasedAt: number | null;
  deletedAt: number | null;
};

type CleanupResult = {
  enabled: boolean;
  deleted: number;
  retained: number;
  failed: number;
};

function isMissing(error: unknown): boolean {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT";
}

// Check every directory component, including public, before touching a file.
// Storage directories must be controlled by the application, never by upload input.
async function safeDirectory(directory: string, create = false): Promise<void> {
  const relative = path.relative(/* turbopackIgnore: true */ process.cwd(), directory);

  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Unsafe media directory");
  }

  // This walk validates runtime storage directories, not bundled assets.
  // Keep its dynamic root opaque to Turbopack's output file tracing.
  let current = path.resolve(/* turbopackIgnore: true */ process.cwd());

  for (const component of relative.split(path.sep)) {
    current = path.join(/* turbopackIgnore: true */ current, component);

    if (create) {
      try {
        await mkdir(/* turbopackIgnore: true */ current);
      } catch (error) {
        if (!(typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST")) {
          throw error;
        }
      }
    }

    const stat = await lstat(/* turbopackIgnore: true */ current);

    if (!stat.isDirectory() || stat.isSymbolicLink()) {
      throw new Error("Unsafe media directory");
    }
  }
}

async function withStorageLock<T>(operation: () => Promise<T>): Promise<T> {
  await safeDirectory(metadataDir, true);

  const lock = path.join(metadataDir, "lock");

  // Only lock acquisition waits; the operation itself is executed exactly once.
  // Never steal a stale lock: a crash requires operator inspection first.
  const deadline = Date.now() + 5000;

  for (;;) {
    try {
      await mkdir(lock);
      break;
    } catch (error) {
      if (!(typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST")) {
        throw error;
      }

      if (Date.now() >= deadline) {
        console.error("[media] Storage lock busy or stale; mutation has not started.");
        throw new Error("Media storage is busy");
      }

      await setTimeout(100);
    }
  }

  try {
    return await operation();
  } finally {
    try {
      await rmdir(lock);
    } catch (error) {
      console.error("[media] Failed to release storage lock; inspect before removing:", error);
    }
  }
}

async function databaseLock(tx: Prisma.TransactionClient): Promise<void> {
  // The SELECT returns an integer rather than PostgreSQL's unsupported void type.
  await tx.$queryRaw`SELECT 1 AS locked FROM pg_advisory_xact_lock(14014)`;
}

function managedFiles(value: unknown): Set<string> {
  const files = new Set<string>();

  function visit(item: unknown) {
    if (typeof item === "string") {
      // Match canonical local URLs, including HTML attributes; external URLs,
      // encoded paths and static assets are never deletion candidates.
      for (const match of item.matchAll(/(?:^|[\s"'(=>])(\/uploads\/news\/[^\s"'<>?#)]+)/g)) {
        const filename = match[1].slice(PREFIX.length);

        if (FILE_NAME.test(filename)) {
          files.add(filename);
        }
      }
    } else if (Array.isArray(item)) {
      item.forEach(visit);
    } else if (item && typeof item === "object") {
      Object.values(item).forEach(visit);
    }
  }

  visit(value);
  return files;
}

async function metadata(filename: string): Promise<Metadata | null> {
  const target = path.join(metadataDir, `${filename}.json`);

  try {
    const stat = await lstat(/* turbopackIgnore: true */ target);

    if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) {
      throw new Error("Unsafe media metadata");
    }

    const value: unknown = JSON.parse(
      await readFile(/* turbopackIgnore: true */ target, "utf8")
    );

    if (
      !value ||
      typeof value !== "object" ||
      !("owner" in value) ||
      typeof value.owner !== "string" ||
      !("releasedAt" in value) ||
      !(value.releasedAt === null ||
        (typeof value.releasedAt === "number" && Number.isFinite(value.releasedAt))) ||
      !("deletedAt" in value) ||
      !(value.deletedAt === null ||
        (typeof value.deletedAt === "number" && Number.isFinite(value.deletedAt)))
    ) {
      throw new Error("Invalid media metadata");
    }

    return {
      owner: value.owner,
      releasedAt: value.releasedAt,
      deletedAt: value.deletedAt
    };
  } catch (error) {
    if (isMissing(error)) {
      return null;
    }

    throw error;
  }
}

async function validateIncoming(value: unknown): Promise<void> {
  for (const filename of managedFiles(value)) {
    // Unmanaged legacy URLs retain their existing behavior.
    const entry = await metadata(filename);

    if (!entry) {
      continue;
    }

    if (entry.deletedAt !== null) {
      throw new Error("Media is no longer available");
    }

    await safeDirectory(uploadDir);

    const stat = await lstat(
      /* turbopackIgnore: true */ path.join(uploadDir, filename)
    );

    if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) {
      throw new Error("Media is no longer available");
    }
  }
}

async function referencedIds(tx: Prisma.TransactionClient): Promise<Set<string>> {
  const ids = new Set<string>();

  // Scan ALL scalar fields of ALL generated models, including rich text and
  // Publication.fileUrl. No assumption that a single media column owns a file.
  // Model identifiers come solely from the generated schema, never user input.
  for (const model of Object.values(Prisma.ModelName)) {
    const table = Prisma.raw(`"${model.replaceAll('"', '""')}"`);

    const rows = await tx.$queryRaw<Array<{ value: string }>>(
      Prisma.sql`SELECT to_jsonb(t)::text AS value FROM ${table} t`
    );

    for (const row of rows) {
      let normalized = row.value;

      for (let pass = 0; pass < 8; pass++) {
        const decoded = normalized
          .replace(
            /%([a-f0-9]{2})/gi,
            (_, hex: string) => String.fromCharCode(parseInt(hex, 16))
          )
          .replace(/&amp;/gi, "&")
          .replace(/&(?:hyphen|dash);/gi, "-")
          .replace(/&#(x[a-f0-9]+|[0-9]+);?/gi, (_, code: string) => {
            const number = code[0].toLowerCase() === "x"
              ? parseInt(code.slice(1), 16)
              : parseInt(code, 10);

            return number <= 0x10ffff ? String.fromCodePoint(number) : "";
          });

        if (decoded === normalized) {
          break;
        }

        normalized = decoded;
      }

      // Ambiguous deeply encoded references fail closed rather than guessing.
      if (/%[a-f0-9]{2}|&#(?:x[a-f0-9]+|[0-9]+)/i.test(normalized)) {
        ids.add("*");
      }

      for (const match of normalized.matchAll(/[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}/gi)) {
        ids.add(match[0].toLowerCase());
      }
    }
  }

  return ids;
}

async function cleanupLocked(files: Iterable<string>): Promise<CleanupResult> {
  // Production must explicitly confirm that every writer uses this same volume
  // and lifecycle helper. Independent instance disks cannot safely delete media.
  const enabled = process.env.NODE_ENV === "development" || process.env.MEDIA_SHARED_STORAGE === "true";

  const result = {
    enabled,
    deleted: 0,
    retained: 0,
    failed: 0
  };

  const candidates = new Set(files);

  if (!candidates.size) {
    return result;
  }

  await prisma.$transaction(async (tx) => {
    await databaseLock(tx);

    const references = enabled
      ? await referencedIds(tx)
      : new Set<string>();

    for (const filename of candidates) {
      if (!FILE_NAME.test(filename)) {
        continue;
      }

      try {
        const entry = await metadata(filename);

        if (!enabled || references.has("*") || references.has(filename.split(".")[0]) || !entry) {
          result.retained++;
          continue;
        }

        if (entry.deletedAt !== null) {
          continue;
        }

        await safeDirectory(uploadDir);

        const target = path.join(uploadDir, filename);
        let deleted = false;

        try {
          const stat = await lstat(/* turbopackIgnore: true */ target);

          if (!stat.isFile() || stat.isSymbolicLink() || stat.nlink !== 1) {
            throw new Error("Unsafe media file");
          }

          await unlink(target);
          deleted = true;
        } catch (error) {
          if (!isMissing(error)) {
            throw error;
          }
        }

        // Keep ownership tombstones: saving a URL after cleanup must fail,
        // rather than silently accepting a dangling managed reference.
        await writeFile(
          path.join(metadataDir, `${filename}.json`),
          JSON.stringify({ ...entry, deletedAt: Date.now() })
        );

        if (deleted) {
          result.deleted++;
        }
      } catch (error) {
        result.failed++;
        console.error("[media] Cleanup failed; file retained where possible:", filename, error);
      }
    }
  }, { timeout: 30000 });

  if (!enabled && result.retained) {
    console.warn("[media] Physical cleanup disabled: shared persistent storage has not been confirmed.");
  }

  return result;
}

export async function mutateWithMedia<T>(
  incoming: unknown,
  mutation: (tx: Prisma.TransactionClient) => Promise<T>,
  previous?: (tx: Prisma.TransactionClient) => Promise<unknown>,
): Promise<T> {
  return withStorageLock(async () => {
    const committed = await prisma.$transaction(async (tx) => {
      await databaseLock(tx);
      await validateIncoming(incoming);

      const candidates = managedFiles(previous ? await previous(tx) : null);
      const value = await mutation(tx);

      return { value, candidates };
    });

    // Database success is final. Cleanup errors are logged separately and must
    // never turn a committed mutation into a retryable database failure.
    try {
      // Persist candidates for later maintenance if immediate cleanup fails.
      for (const filename of committed.candidates) {
        const entry = await metadata(filename);

        if (entry && entry.deletedAt === null && entry.releasedAt === null) {
          await writeFile(
            path.join(metadataDir, `${filename}.json`),
            JSON.stringify({ ...entry, releasedAt: Date.now() })
          );
        }
      }

      await cleanupLocked(committed.candidates);
    } catch (error) {
      console.error("[media] Database committed; cleanup deferred:", error);
    }

    return committed.value;
  });
}

export async function storeManagedUpload(
  buffer: Buffer,
  extension: string,
  owner: string
): Promise<string> {
  if (!/^(png|jpe?g|webp)$/.test(extension)) {
    throw new Error("Invalid media extension");
  }

  return withStorageLock(async () => {
    await safeDirectory(uploadDir, true);

    const filename = `${randomUUID()}.${extension}`;

    // Claim ownership only after an exclusive successful write. Even a UUID
    // collision must never adopt an existing static/unmanaged file for deletion.
    // Failed/partial writes or failed metadata writes remain unowned and retained.
    await writeFile(
      path.join(uploadDir, filename),
      buffer,
      { flag: "wx" }
    );

    await writeFile(
      path.join(metadataDir, `${filename}.json`),
      JSON.stringify({ owner, releasedAt: null, deletedAt: null }),
      { flag: "wx" }
    );

    return `${PREFIX}${filename}`;
  });
}

export async function releaseManagedUploads(
  urls: string[],
  owner: string
): Promise<void> {
  await withStorageLock(async () => {
    for (const url of urls) {
      const filename = url.startsWith(PREFIX)
        ? url.slice(PREFIX.length)
        : "";

      if (!FILE_NAME.test(filename)) {
        continue;
      }

      const entry = await metadata(filename);

      if (!entry || entry.owner !== owner || entry.releasedAt !== null || entry.deletedAt !== null) {
        continue;
      }

      await writeFile(
        path.join(metadataDir, `${filename}.json`),
        JSON.stringify({ ...entry, releasedAt: Date.now() })
      );
    }
  });
}

export async function cleanupReleasedUploads(): Promise<CleanupResult> {
  return withStorageLock(async () => {
    const files: string[] = [];

    for (const name of await readdir(/* turbopackIgnore: true */ metadataDir)) {
      const filename = name.endsWith(".json")
        ? name.slice(0, -5)
        : "";

      if (!FILE_NAME.test(filename)) {
        continue;
      }

      const entry = await metadata(filename);

      // No expiry for unreleased uploads: an open/suspended form may still use it.
      if (
        entry &&
        entry.deletedAt === null &&
        entry.releasedAt !== null &&
        entry.releasedAt + RELEASE_TTL <= Date.now()
      ) {
        files.push(filename);
      }
    }

    return cleanupLocked(files);
  });
}