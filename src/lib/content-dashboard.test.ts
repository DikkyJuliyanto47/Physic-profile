import assert from "node:assert/strict";
import { test } from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { createElement } from "react";
import type { ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { contentListScope, contentPermissions } from "./content-permissions";
import type { ContentActor, ContentState } from "./content-workflow";

const requirePackage = createRequire(resolve("package.json"));
const author = { id: "author", role: "ADMIN" };
const superAdmin = { id: "reviewer", role: "SUPER_ADMIN" };
const draft: ContentState = {
  authorId: "author", status: "DRAFT", reviewStatus: "DRAFT", contentVersion: 1,
};

// Render real dashboard components with isolated session/navigation dependencies.
function render(file: string, name: string, actor: ContentActor | null,
  props: Record<string, unknown>) {
  function load(path: string): Record<string, ComponentType<Record<string, unknown>>> {
    const exports = {};
    const code = ts.transpileModule(readFileSync(resolve(path), "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
      },
    }).outputText;
    runInNewContext(code, {
      exports,
      require(dependency: string) {
        if (dependency === "next/navigation") return { useRouter: () => ({}) };
        if (dependency.endsWith("use-content-permissions")) return {
          useContentPermissions: (state?: ContentState) => ({
            ...contentPermissions(actor, state), loading: actor === null,
          }),
        };
        if (dependency === "next/link") return {
          __esModule: true,
          default: (attributes: Record<string, unknown>) => createElement("a", attributes),
        };
        if (dependency.startsWith("@/actions/")) return {};
        if (dependency === "./ReviewStatusBadge") {
          return load("src/components/admin/ReviewStatusBadge.tsx");
        }
        return requirePackage(dependency);
      },
    });
    return exports;
  }
  return renderToStaticMarkup(createElement(load(file)[name], props));
}

for (const [dir, title, id] of [
  ["news", "News", "news"], ["events", "Event", "event"],
  ["publication", "Publication", "publication"],
]) {
  test(`${title}: Admin sees edit/delete only for own editable draft`, () => {
    const file = `src/app/(admin)/admin/${dir}/${title}Actions.tsx`;
    const props = { state: draft, [`${id}Id`]: "1", [`${id}Title`]: "Test",
      currentStatus: "DRAFT", contentVersion: 1 };
    const editable = render(file, `${title}Actions`, author, props);
    assert.match(editable, />Edit</);
    assert.match(editable, />Hapus</);
    assert.doesNotMatch(editable, /title="Terbitkan"/);
    for (const reviewStatus of ["PENDING_REVIEW", "APPROVED"] as const) {
      const html = render(file, `${title}Actions`, author, {
        ...props, state: { ...draft, reviewStatus },
      });
      assert.doesNotMatch(html, />Edit</);
      assert.doesNotMatch(html, />Hapus</);
      assert.match(html, />Lihat</);
    }
    const other = render(file, `${title}Actions`, { id: "other", role: "ADMIN" }, props);
    assert.doesNotMatch(other, />Edit<|>Hapus<|>Lihat</);
    const admin = render(file, `${title}Actions`, superAdmin, props);
    assert.match(admin, />Edit</);
    assert.match(admin, />Hapus</);
  });
}

test("review controls show only allowed actions and escape reviewer notes", () => {
  const file = "src/components/admin/ContentReviewControls.tsx";
  const props = { kind: "news", id: "1", state: draft };
  const admin = render(file, "ContentReviewControls", author, props);
  assert.match(admin, /Ajukan Review/);
  assert.doesNotMatch(admin, /Setujui|Minta Revisi|Terbitkan langsung/);
  const pending = { ...draft, reviewStatus: "PENDING_REVIEW" };
  const review = render(file, "ContentReviewControls", superAdmin, { ...props, state: pending });
  assert.match(review, /Setujui/);
  assert.match(review, /Minta Revisi/);
  assert.match(review, /label for=/);
  const revision = render(file, "ContentReviewControls", author, {
    ...props, state: { ...draft, reviewStatus: "REVISION_REQUIRED", reviewNote: "<script>catatan</script>" },
  });
  assert.match(revision, /Perlu revisi/);
  assert.match(revision, /Ajukan Review/);
  assert.match(revision, /&lt;script&gt;/);
  assert.doesNotMatch(revision, /<script>/);
  const dirty = render(file, "ContentReviewControls", author, { ...props, disabled: true });
  assert.match(dirty, /disabled=""/);
});

test("permissions deny foreign/legacy ownership and allow Super Admin management", () => {
  for (const state of [
    { ...draft, authorId: null }, { ...draft, authorId: "other" },
    { ...draft, status: "PUBLISHED" as const },
    { ...draft, status: "ARCHIVED" as const },
  ]) {
    assert.equal(contentPermissions(author, state).canEdit, false);
    assert.equal(contentPermissions(author, state).canDelete, false);
    assert.equal(contentPermissions(superAdmin, state).canEdit, true);
  }
  assert.equal(contentPermissions(null, draft).canSubmit, false);
  assert.equal(contentPermissions(author, { ...draft, reviewStatus: "REVISION_REQUIRED" }).canSubmit, true);
});

test("Admin lists own submissions and published organization content only", () => {
  assert.deepEqual(contentListScope(superAdmin), {});
  assert.deepEqual(contentListScope(author), {
    AND: [{ OR: [
      { authorId: "author" }, { status: "PUBLISHED", reviewStatus: "APPROVED" },
    ] }],
  });
});

test("all review filters and destination feedback are accessible", () => {
  const filter = render("src/components/admin/ReviewStatusBadge.tsx", "ReviewFilter", author, {
    value: "PENDING_REVIEW",
  });
  assert.match(filter, /aria-label="Status pengajuan"/);
  assert.match(filter, /value="PENDING_REVIEW" selected=""/);
  for (const result of ["saved", "submit", "approve", "revision", "deleted"]) {
    assert.match(render("src/components/admin/ContentFeedback.tsx", "ContentFeedback", author, {
      result,
    }), /role="status"/);
  }
});
