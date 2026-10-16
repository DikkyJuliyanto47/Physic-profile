"use server";
import type { ContentVersion } from "@/lib/content-workflow";
import { submitContent, type ContentResult } from "@/lib/content-approval";
import type { ContentStatus, NewsCategory } from "@/generated/prisma/client";

export type NewsInput = {
  title: string;
  category: NewsCategory;
  excerpt?: string;
  content: string;
  imageUrl?: string;
  status: ContentStatus;
  eventDate?: string;
};

export type ActionResponse = ContentResult;

export async function createNews(data: NewsInput): Promise<ActionResponse> {
  return submitContent("news", "CREATE", null, data);
}

export async function updateNews(id: string, data: NewsInput, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("news", "UPDATE", id, data, false, version);
}

export async function deleteNews(id: string, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("news", "DELETE", id, {}, false, version);
}

export async function toggleNewsStatus(id: string, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("news", "UPDATE", id, {}, true, version);
}
