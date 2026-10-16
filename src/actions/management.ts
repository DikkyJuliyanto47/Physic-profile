"use server";
import { submitContent, type ContentResult } from "@/lib/content-approval";

export type ActionResponse = ContentResult;

export type ManagementPeriodInput = {
  period: string;
  isActive?: boolean;
};

export type ManagementPositionInput = {
  periodId: string;
  memberProfileId?: string | null;
  title: string;
  department?: string | null;
  order?: number | string;
};

export async function createManagementPeriod(data: ManagementPeriodInput): Promise<ActionResponse> {
  return submitContent("managementPeriod", "CREATE", null, data);
}

export async function updateManagementPeriod(id: string, data: ManagementPeriodInput): Promise<ActionResponse> {
  return submitContent("managementPeriod", "UPDATE", id, data);
}

export async function deleteManagementPeriod(id: string): Promise<ActionResponse> {
  return submitContent("managementPeriod", "DELETE", id);
}

export async function setActiveManagementPeriod(id: string): Promise<ActionResponse> {
  return submitContent("managementPeriod", "UPDATE", id, { isActive: true });
}

export async function createManagementPosition(data: ManagementPositionInput): Promise<ActionResponse> {
  return submitContent("managementPosition", "CREATE", null, data);
}

export async function updateManagementPosition(id: string, data: ManagementPositionInput): Promise<ActionResponse> {
  return submitContent("managementPosition", "UPDATE", id, data);
}

export async function deleteManagementPosition(id: string): Promise<ActionResponse> {
  return submitContent("managementPosition", "DELETE", id);
}
