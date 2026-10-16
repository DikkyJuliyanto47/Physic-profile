"use server";
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

export async function updateUniversity(id: string, data: UniversityInput): Promise<ActionResponse> {
  return submitContent("university", "UPDATE", id, data);
}

export async function deleteUniversity(id: string): Promise<ActionResponse> {
  return submitContent("university", "DELETE", id);
}
