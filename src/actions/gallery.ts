"use server";
import type { ContentVersion } from "@/lib/content-workflow";
import { submitContent, type ContentResult } from "@/lib/content-approval";
import type { MediaType } from "@/generated/prisma/client";

export type GalleryInput = {
  title: string;
  mediaType: MediaType;
  mediaUrl: string;
  category?: string;
  description?: string;
  isFeatured: boolean;
  sortOrder: number;
};

export type ActionResponse = ContentResult;

export async function createGallery(data: GalleryInput): Promise<ActionResponse> {
  return submitContent("gallery", "CREATE", null, data);
}

export async function updateGallery(id: string, data: GalleryInput, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("gallery", "UPDATE", id, data, false, version);
}

export async function deleteGallery(id: string, version: ContentVersion): Promise<ActionResponse> {
  return submitContent("gallery", "DELETE", id, {}, false, version);
}
export const createGalleryItem = createGallery;

export const updateGalleryItem = updateGallery;

export const deleteGalleryItem = deleteGallery;
