"use server";
import type { ContentVersion } from "@/lib/content-workflow";
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

export async function createManagementPeriod(
  data: ManagementPeriodInput,
): Promise<ActionResponse> {
  return submitContent("managementPeriod", "CREATE", null, data);
}

export async function updateManagementPeriod(
  id: string,
  data: ManagementPeriodInput,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent("managementPeriod", "UPDATE", id, data, false, version);
}

export async function deleteManagementPeriod(
  id: string,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent("managementPeriod", "DELETE", id, {}, false, version);
}

export async function setActiveManagementPeriod(
  id: string,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent(
    "managementPeriod",
    "UPDATE",
    id,
    { isActive: true },
    false,
    version,
  );
}

export async function createManagementPosition(
  data: ManagementPositionInput,
): Promise<ActionResponse> {
  return submitContent("managementPosition", "CREATE", null, data);
}

export async function updateManagementPosition(
  id: string,
  data: ManagementPositionInput,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent(
    "managementPosition",
    "UPDATE",
    id,
    data,
    false,
    version,
  );
}

export async function deleteManagementPosition(
  id: string,
  version: ContentVersion,
): Promise<ActionResponse> {
  return submitContent("managementPosition", "DELETE", id, {}, false, version);
}
