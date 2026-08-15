export const MOCK_AUTH_COOKIE_NAME = "psi_mock_auth";

export const MOCK_AUTH_USER = {
  id: "mock-admin",
  name: "Admin PSI",
  email: "admin@psi.local",
  role: "ADMIN",
} as const;

export type MockAuthUser = typeof MOCK_AUTH_USER;

export function isMockAuthEnabled(): boolean {
  const mockFlag =
    process.env.NEXT_PUBLIC_MOCK_AUTH ?? process.env.MOCK_AUTH ?? "false";

  return mockFlag === "true";
}

export function getMockAuthCookieValue(cookieHeader?: string | null): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === MOCK_AUTH_COOKIE_NAME) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return undefined;
}

export function hasMockAuthCookieValue(cookieValue?: string | null): boolean {
  return getMockAuthCookieValue(cookieValue) === "true";
}

export function hasMockAuthCookieStore(
  cookiesLike?: { get?: (name: string) => { value?: string } | undefined },
): boolean {
  const value = cookiesLike?.get?.(MOCK_AUTH_COOKIE_NAME)?.value;
  return value === "true";
}

export function setMockAuthCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  const secureFlag = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${MOCK_AUTH_COOKIE_NAME}=true; path=/; samesite=lax${secureFlag}`;
}

export function clearMockAuthCookie(): void {
  if (typeof document === "undefined") {
    return;
  }

  const secureFlag = window.location.protocol === "https:" ? "; secure" : "";
  document.cookie = `${MOCK_AUTH_COOKIE_NAME}=; Max-Age=0; path=/; samesite=lax${secureFlag}`;
}
