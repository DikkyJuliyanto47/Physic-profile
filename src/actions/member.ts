"use server";
import type { ContentVersion } from "@/lib/content-workflow";
import { submitContent, type ContentResult } from "@/lib/content-approval";

export type MemberInput = {
  detailUrl: string;
  name: string;
  email: string;
  institutionId?: string;
  fieldOfExpertise?: string;
  photoUrl?: string;
  profileUrl?: string;
};

export type ActionResponse = ContentResult;

export async function createMember(data: MemberInput): Promise<ActionResponse> {
  return submitContent("member", "CREATE", null, data);
}

export async function updateMember(
  id: string,
  data: MemberInput,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent("member", "UPDATE", id, data, false, version);
}

export async function deleteMember(
  id: string,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent("member", "DELETE", id, {}, false, version);
}
