import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as policy from "./content-workflow";
import { publishedContent, publishedPublications } from "./content-visibility";
import type { ContentKind, ContentState } from "./content-workflow";

type Row = ContentState & { id: string; slug: string; publishedAt: Date | null };
type Arguments = { where?: Record<string, unknown>; data?: Record<string, unknown>; select?: unknown };
type Response = { success: boolean; error?: string; id?: string };
type Actions = Record<string, (...args: unknown[]) => Promise<Response>>;

function harness(kind: ContentKind) {
  const rows = new Map<string, Row>();
  const actor = { id: "author", role: "ADMIN" };
  let authenticated = true;
  const matches = (row: Row, where: Record<string, unknown> = {}) =>
    Object.entries(where).every(([key, value]) => Reflect.get(row, key) === value);
  const apply = (row: Row, data: Record<string, unknown> = {}) => {
    for (const [key, value] of Object.entries(data)) {
      if (value === undefined) continue;
      Reflect.set(row, key, key === "contentVersion" && typeof value === "object"
        ? row.contentVersion + 1 : value);
    }
    return { ...row };
  };
  const delegate = {
    async findUnique({ where }: Arguments) {
      const row = [...rows.values()].find((item) => matches(item, where));
      return row ? { ...row } : null;
    },
    async create({ data }: Arguments) {
      const row = apply({
        id: "content", slug: "content", authorId: null, contentVersion: 1,
        reviewStatus: "DRAFT", publishedAt: null,
        status: "DRAFT",
      }, data);
      rows.set(row.id, row);
      return row;
    },
    async updateMany({ where, data }: Arguments) {
      const row = [...rows.values()].find((item) => matches(item, where));
      if (!row) return { count: 0 };
      apply(row, data);
      return { count: 1 };
    },
    async update(args: Arguments) {
      const row = [...rows.values()].find((item) => matches(item, args.where));
      if (!row) throw new Error("Stale write");
      return apply(row, args.data);
    },
    async delete({ where }: Arguments) {
      const row = [...rows.values()].find((item) => matches(item, where));
      if (!row) throw new Error("Stale delete");
      rows.delete(row.id);
      return row;
    },
  };
  const tx = { news: delegate, event: delegate, publication: delegate };
  const prisma = { ...tx, $transaction: async (run: (value: typeof tx) => unknown) => run(tx) };
  function load(file: string): Actions {
    const source = ts.transpileModule(readFileSync(resolve(file), "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText;
    const exports = {};
    runInNewContext(source, {
      exports, Date, console: { error() {} },
      require(name: string) {
        if (name === "@/lib/auth-utils") return {
          requireAdmin: async () => authenticated ? { user: actor } : null,
        };
        if (name === "@/lib/prisma") return { prisma };
        if (name === "@/lib/content-workflow") return policy;
        if (name === "./content-review") return review;
        if (name === "next/cache") return { revalidatePath() {}, updateTag() {} };
        if (name === "@/lib/news-event-date") return { parseNewsEventDate: () => null };
        if (name === "@/lib/media-lifecycle") return {
          mutateWithMedia: async (_data: unknown, run: (value: typeof tx) => unknown) => run(tx),
        };
        if (name === "@/generated/prisma/client") return {
          ContentStatus: { DRAFT: "DRAFT", PUBLISHED: "PUBLISHED", ARCHIVED: "ARCHIVED" },
          EventCategory: { WEBINAR: "WEBINAR" },
        };
        throw new Error(`Unexpected dependency: ${name}`);
      },
    });
    return exports as Actions;
  }
  const review = load("src/actions/content-review.ts");
  const actions = load(`src/actions/${kind}.ts`);
  const suffix = kind === "news" ? "News" : kind === "event" ? "Event" : "Publication";
  const input = {
    title: "Content", content: "Body", description: "Body",
    category: kind === "news" ? "ORGANISASI" : "WEBINAR",
    startDate: "2027-01-01T10:00", status: "DRAFT", type: "JURNAL",
    publishedAt: "2027-01-02", contentVersion: 1,
  };
  return { actor, rows, input, actions, suffix,
    logout: () => { authenticated = false; },
    run: (operation: string, version: number, note?: string) =>
      review.reviewContent(kind, "content", version, operation, note),
  };
}

for (const kind of ["news", "event", "publication"] as const) {
  test(`${kind}: direct Server Actions enforce ownership and review lifecycle`, async () => {
    const h = harness(kind);
    assert.equal((await h.actions[`create${h.suffix}`](h.input)).success, true);
    assert.equal(h.rows.get("content")?.authorId, "author");
    assert.equal(h.rows.get("content")?.reviewStatus, "DRAFT");
    const publish = { ...h.input, status: "PUBLISHED", intent: "publish" };
    assert.equal((await h.actions[`update${h.suffix}`]("content", publish)).success, false);
    assert.equal((await h.run("publish", 1)).success, false);
    assert.equal((await h.run("approve", 1)).success, false);
    h.actor.id = "other";
    assert.equal((await h.actions[`update${h.suffix}`]("content", h.input)).success, false);
    assert.equal((await h.actions[`delete${h.suffix}`]("content")).success, false);
    h.actor.id = "author";
    assert.equal((await h.run("submit", 1)).success, true);
    assert.equal((await h.actions[`update${h.suffix}`]("content", { ...h.input, contentVersion: 2 })).success, false);
    h.actor.role = "SUPER_ADMIN";
    assert.equal((await h.run("revision", 2, "")).success, false);
    assert.equal((await h.run("revision", 2, "Lengkapi sumber")).success, true);
    h.actor.role = "ADMIN";
    assert.equal((await h.actions[`update${h.suffix}`]("content", { ...h.input, contentVersion: 3 })).success, true);
    assert.equal((await h.run("submit", 4)).success, true);
    const schedule = h.rows.get("content")!.publishedAt;
    h.actor.role = "SUPER_ADMIN";
    const results = await Promise.all([h.run("approve", 5), h.run("approve", 5)]);
    assert.equal(results.filter((result) => result.success).length, 1);
    if (kind === "publication") assert.equal(h.rows.get("content")!.publishedAt, schedule);
    h.actor.role = "ADMIN";
    assert.equal((await h.actions[`update${h.suffix}`]("content", { ...h.input, contentVersion: 6 })).success, false);
    assert.equal((await h.actions[`delete${h.suffix}`]("content")).success, false);
    h.actor.role = "SUPER_ADMIN";
    assert.equal((await h.run("unpublish", 6)).success, true);
    assert.equal((await h.run("publish", 7)).success, true);
    assert.equal((await h.run("archive", 8)).success, true);
    assert.equal(h.rows.get("content")!.status, "ARCHIVED");
    h.actor.role = "ADMIN";
    assert.equal((await h.run("submit", 9)).success, false);
  });

  test(`${kind}: Admin cannot create published; Super Admin can`, async () => {
    const h = harness(kind);
    const input = { ...h.input, status: "PUBLISHED", intent: "publish" };
    assert.equal((await h.actions[`create${h.suffix}`](input)).success, false);
    h.actor.role = "SUPER_ADMIN";
    assert.equal((await h.actions[`create${h.suffix}`](input)).success, true);
    assert.equal(h.rows.get("content")?.reviewStatus, "APPROVED");
  });

  test(`${kind}: direct calls reject stale edits and unauthenticated writes`, async () => {
    const h = harness(kind);
    await h.actions[`create${h.suffix}`](h.input);
    assert.equal((await h.actions[`update${h.suffix}`]("content", {
      ...h.input, contentVersion: 0,
    })).success, false);
    if (kind !== "publication") {
      assert.equal((await h.actions[`toggle${h.suffix}Status`]("content", 1)).success, false);
    }
    h.logout();
    assert.equal((await h.actions[`create${h.suffix}`](h.input)).success, false);
    assert.equal((await h.actions[`update${h.suffix}`]("content", h.input)).success, false);
    assert.equal((await h.actions[`delete${h.suffix}`]("content")).success, false);
    assert.equal((await h.run("submit", 1)).success, false);
  });
}

test("legacy publication without author is editable only by Super Admin", async () => {
  const h = harness("publication");
  await h.actions.createPublication(h.input);
  h.rows.get("content")!.authorId = null;
  assert.equal((await h.actions.updatePublication("content", h.input)).success, false);
  h.actor.role = "SUPER_ADMIN";
  assert.equal((await h.actions.updatePublication("content", h.input)).success, true);
});

test("saving a legacy publication retains its precise schedule when date is unchanged", async () => {
  const h = harness("publication");
  await h.actions.createPublication(h.input);
  const schedule = new Date("2027-01-02T09:30:00Z");
  h.rows.get("content")!.publishedAt = schedule;
  h.actor.role = "SUPER_ADMIN";
  assert.equal((await h.actions.updatePublication("content", {
    ...h.input, intent: "publish",
  })).success, true);
  assert.equal(h.rows.get("content")!.publishedAt, schedule);
});

test("visibility predicates exclude pending and retain legacy approved schedules", () => {
  assert.deepEqual(publishedContent, { status: "PUBLISHED", reviewStatus: "APPROVED" });
  const now = new Date("2027-01-01T00:00:00Z");
  const predicate = publishedPublications(now);
  assert.equal(predicate.status, "PUBLISHED");
  const visible = (reviewStatus: string, date: Date | null) =>
    reviewStatus === predicate.reviewStatus && date !== predicate.publishedAt.not &&
    date !== null && date <= predicate.publishedAt.lte;
  assert.equal(visible("PENDING_REVIEW", new Date("2026-01-01")), false);
  assert.equal(visible("REVISION_REQUIRED", new Date("2026-01-01")), false);
  assert.equal(visible("APPROVED", new Date("2026-01-01")), true);
  assert.equal(visible("APPROVED", new Date("2028-01-01")), false);
  assert.equal(visible("APPROVED", null), false);
});
