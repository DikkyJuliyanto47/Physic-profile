"use client";

import { useSession } from "next-auth/react";
import { contentPermissions } from "@/lib/content-permissions";
import type { ContentState } from "@/lib/content-workflow";
import { isMockAuthEnabled, MOCK_AUTH_USER } from "@/lib/mock-auth";

export function useContentPermissions(state?: ContentState) {
  const { data, status } = useSession();
  const actor = data?.user ?? (isMockAuthEnabled() ? MOCK_AUTH_USER : null);
  return { ...contentPermissions(actor, state), loading: !actor && status === "loading" };
}
