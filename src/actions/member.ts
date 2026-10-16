"use server";
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

export async function updateMember(id: string, data: MemberInput): Promise<ActionResponse> {
  return submitContent("member", "UPDATE", id, data);
}

export async function deleteMember(id: string): Promise<ActionResponse> {
  return submitContent("member", "DELETE", id);
}
