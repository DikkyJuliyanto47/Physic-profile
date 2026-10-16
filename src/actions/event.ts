"use server";
import { submitContent, type ContentResult } from "@/lib/content-approval";
import type { EventCategory, ContentStatus } from "@/generated/prisma/client";

export type EventInput = {
  title: string;
  category: EventCategory;
  description: string;
  startDate: string;
  endDate?: string;
  location?: string;
  linkUrl?: string;
  imageUrl?: string;
  status: ContentStatus;
};

export type ActionResponse = ContentResult;

export async function createEvent(data: EventInput): Promise<ActionResponse> {
  return submitContent("event", "CREATE", null, data);
}

export async function updateEvent(id: string, data: EventInput): Promise<ActionResponse> {
  return submitContent("event", "UPDATE", id, data);
}

export async function deleteEvent(id: string): Promise<ActionResponse> {
  return submitContent("event", "DELETE", id);
}

export async function toggleEventStatus(id: string): Promise<ActionResponse> {
  return submitContent("event", "UPDATE", id, {}, true);
}
