"use server";
import { submitContent, type ContentResult } from "@/lib/content-approval";
import type { PublicationInput } from "@/types/publication";

export type ActionResponse = ContentResult;

export async function createPublication(data: PublicationInput): Promise<ActionResponse> {
  return submitContent("publication", "CREATE", null, data);
}

export async function updatePublication(id: string, data: PublicationInput): Promise<ActionResponse> {
  return submitContent("publication", "UPDATE", id, data);
}

export async function deletePublication(id: string): Promise<ActionResponse> {
  return submitContent("publication", "DELETE", id);
}
