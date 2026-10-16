"use server";
import type { ContentVersion } from "@/lib/content-workflow";
import { submitContent, type ContentResult } from "@/lib/content-approval";

export type UniversityInput = {
  name: string;
  shortName?: string;
  address?: string;
  deptUrl?: string;
  websiteUrl?: string;
  logoUrl?: string;
  description?: string;
};

export type ActionResponse = ContentResult;

export async function createUniversity(data: UniversityInput): Promise<ActionResponse> {
  return submitContent("university", "CREATE", null, data);
}

export async function updateUniversity(id: string, data: UniversityInput, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("university", "UPDATE", id, data, false, version);
}

export async function deleteUniversity(id: string, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("university", "DELETE", id, {}, false, version);
}
