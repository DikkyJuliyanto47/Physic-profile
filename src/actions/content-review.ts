"use server";
import {
  decideContent,
  reviseContent,
  type ContentResult,
} from "@/lib/content-approval";
export async function reviewContent(
  id: string,
  version: number,
  operation: "approve" | "revision",
  note?: string,
): Promise<ContentResult> {
  return decideContent(id, version, operation, note);
}
export async function resubmitContent(
  id: string,
  version: number,
  input: unknown,
): Promise<ContentResult> {
  return reviseContent(id, version, input);
}
