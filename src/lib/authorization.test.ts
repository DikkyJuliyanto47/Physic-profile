import assert from "node:assert/strict";
import { test } from "node:test";
import { NextRequest } from "next/server";
import { authConfig } from "../auth.config";
import { createAuthorizationGuards, isAdminRole } from "./authorization";
import { MOCK_AUTH_USER } from "./mock-auth";

type Dependencies = Parameters<typeof createAuthorizationGuards>[0];

function fixture(role = "ADMIN") {
  const session = {
    user: { id: "account-1", role: "UNTRUSTED", sessionVersion: 1 },
    expires: "2099-01-01T00:00:00Z",
  };
  const account = { role, isActive: true, sessionVersion: 1 };
  const dependencies: Dependencies = {
    getSession: async () => session,
    findAccount: async (id) => {
      assert.equal(id, session.user.id);
      return account;
    },
    isMockEnabled: () => false,
  };
  return { session, account, dependencies };
}

for (const role of ["ADMIN", "SUPER_ADMIN"]) {
  test(`${role} passes admin guard using database role`, async () => {
    const { dependencies } = fixture(role);
    const result = await createAuthorizationGuards(dependencies).requireAdmin();
    assert.equal(result?.user.role, role);
  });

  test(`${role} super admin permission`, async () => {
    const { dependencies } = fixture(role);
    const result = await createAuthorizationGuards(dependencies).requireSuperAdmin();
    assert.equal(result?.user.role ?? null, role === "SUPER_ADMIN" ? role : null);
  });
}

for (const guard of ["requireAdmin", "requireSuperAdmin"] as const) {
  test(`${guard} denies inactive accounts`, async () => {
    const { dependencies, account } = fixture("SUPER_ADMIN");
    account.isActive = false;
    assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
  });

  test(`${guard} denies mismatched or missing session versions`, async () => {
    const { dependencies, session } = fixture("SUPER_ADMIN");
    session.user.sessionVersion = 2;
    assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
    dependencies.getSession = async () => ({
      ...session,
      user: { id: session.user.id, role: "SUPER_ADMIN" },
    });
    assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
  });

  test(`${guard} denies invalid or missing database roles`, async () => {
    const { dependencies, account } = fixture();
    for (const role of ["OWNER", "", undefined]) {
      dependencies.findAccount = async () => ({
        ...account,
        role,
      });
      assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
    }
  });

  test(`${guard} denies missing sessions and deleted accounts`, async () => {
    const { dependencies } = fixture();
    dependencies.findAccount = async () => null;
    assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
    dependencies.getSession = async () => null;
    assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
  });

  test(`${guard} stops before lookup when session has no id`, async () => {
    const { dependencies, session } = fixture();
    session.user.id = "";
    dependencies.findAccount = async () => assert.fail("Unexpected lookup");
    assert.equal(await createAuthorizationGuards(dependencies)[guard](), null);
  });

  test(`${guard} does not grant access on database failure`, async () => {
    const { dependencies } = fixture();
    dependencies.findAccount = async () => {
      throw new Error("Database unavailable");
    };
    await assert.rejects(createAuthorizationGuards(dependencies)[guard], {
      message: "Database unavailable",
    });
  });
}

test("database demotion overrides a stale SUPER_ADMIN session", async () => {
  const { dependencies, session } = fixture("ADMIN");
  session.user.role = "SUPER_ADMIN";
  assert.equal(await createAuthorizationGuards(dependencies).requireSuperAdmin(), null);
});

test("mock development session remains ADMIN only", async () => {
  const { dependencies } = fixture();
  dependencies.isMockEnabled = () => true;
  dependencies.getSession = async () => ({
    user: { ...MOCK_AUTH_USER },
    expires: "2099-01-01T00:00:00Z",
  });
  dependencies.findAccount = async () => {
    assert.fail("Synthetic sessions should not query the database");
  };
  const guards = createAuthorizationGuards(dependencies);
  assert.equal((await guards.requireAdmin())?.user.role, "ADMIN");
  assert.equal(await guards.requireSuperAdmin(), null);
  dependencies.isMockEnabled = () => false;
  dependencies.findAccount = async () => null;
  assert.equal(await guards.requireAdmin(), null);
});

test("middleware session preserves valid JWT roles and rejects missing roles", async () => {
  for (const role of ["ADMIN", "SUPER_ADMIN", "OWNER", undefined]) {
    const session = { user: { id: "account-1", role: "" }, expires: "" };
    const result = await authConfig.callbacks.session({
      session,
      token: { id: "account-1", role, sessionVersion: 1 },
    } as Parameters<typeof authConfig.callbacks.session>[0]);
    assert.equal(result.user.role, isAdminRole(role) ? role : "");
    const request = new NextRequest("https://psi.test/admin");
    const decision = await authConfig.callbacks.authorized({ auth: result, request });
    if (isAdminRole(role)) {
      assert.equal(decision, true);
    } else {
      assert.ok(decision instanceof Response);
      assert.equal(decision.headers.get("location"), "https://psi.test/login");
    }
  }
});
