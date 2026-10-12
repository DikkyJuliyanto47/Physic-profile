import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth-utils";
import { cleanupReleasedUploads } from "@/lib/media-lifecycle";

// Explicit maintenance trigger for quiet deployments; no GET side effects.
export async function POST() {
  try {
    const session = await requireAdmin();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const result = await cleanupReleasedUploads();
    const disabled = !result.enabled && result.retained > 0;
    return NextResponse.json({ success: result.failed === 0 && !disabled, ...result }, {
      status: result.failed ? 500 : disabled ? 503 : 200,
    });
  } catch (error) {
    console.error("[media] Maintenance cleanup failed:", error);
    return NextResponse.json({ error: "Cleanup gagal." }, { status: 500 });
  }
}
