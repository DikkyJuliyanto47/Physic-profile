"use server";
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

export async function updateGallery(id: string, data: GalleryInput): Promise<ActionResponse> {
  return submitContent("gallery", "UPDATE", id, data);
}

export async function deleteGallery(id: string): Promise<ActionResponse> {
  return submitContent("gallery", "DELETE", id);
}
export const createGalleryItem = createGallery;

export const updateGalleryItem = updateGallery;

export const deleteGalleryItem = deleteGallery;
