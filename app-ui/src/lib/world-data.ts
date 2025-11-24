"use client";

import { apiRequest } from "./api-client";
import { ItemFormData, WorldEntity, WorldItem } from "./types";

export type { WorldEntity, WorldItem, ItemFormData } from "./types";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";

function buildPayload(data: Partial<WorldItem>) {
  const cloned = { ...data } as Record<string, unknown>;
  delete cloned.id;
  delete cloned.worldId;
  delete cloned.type;
  delete cloned.name;
  return cloned;
}

export async function getItemsByType(
  worldId: string,
  type: string
): Promise<WorldItem[]> {
  if (!worldId) return [];
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return apiRequest<WorldItem[]>(`/worlds/${worldId}/items${query}`);
}

export async function getItemById(itemId: string): Promise<WorldItem | null> {
  if (!itemId) return null;
  return apiRequest<WorldItem>(`/world-items/${itemId}`);
}

export async function saveNewItem(
  worldId: string,
  type: string,
  data: ItemFormData | Partial<WorldItem>,
  imageFile?: File | null,
  galleryFiles?: File[]
): Promise<string> {
  const formData = new FormData();

  const { name, ...rest } = data;

  const itemName = name || "Unnamed Item";

  formData.append("type", type);
  formData.append("name", itemName);

  formData.append("payload", JSON.stringify(rest));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  if (galleryFiles && galleryFiles.length > 0) {
    galleryFiles.forEach((file) => {
      formData.append("gallery", file);
    });
  }

  const response = await apiRequest<WorldItem>(`/worlds/${worldId}/items`, {
    method: "POST",
    body: formData,
  });

  return response.id;
}

export interface UpdateItemPayload extends Partial<ItemFormData> {
  id?: string;
  worldId?: string;
  type?: string;

  existingGalleryImages?: string[];
}

export async function updateItem(
  itemId: string,
  data: UpdateItemPayload,
  coverFile?: File | null,
  newGalleryFiles?: File[]
): Promise<string> {
  console.log("--- DEBUG: updateItem RECEIVED DATA ---");
  console.log(`Artifact ID (itemId): ${itemId}`);
  console.log("Input Data (Text/Payload):", data);
  console.log("Cover File:", coverFile?.name || "None");
  console.log("New Gallery Files Count:", newGalleryFiles?.length || 0);
  console.log("Existing Gallery Images (to keep):", data.existingGalleryImages);
  console.log("newGalleryFiles  :", newGalleryFiles);
  console.log("---------------------------------------");

  const formData = new FormData();

  const { name, existingGalleryImages, ...restData } = data;

  const payload = buildPayload(restData as Partial<WorldItem>);

  formData.append("name", name || "Unnamed");
  formData.append("payload", JSON.stringify(payload));

  if (coverFile) {
    formData.append("image", coverFile);
  }

  if (newGalleryFiles && newGalleryFiles.length > 0) {
    newGalleryFiles.forEach((file) => {
      formData.append("galleryImages", file);
    });
  }

  if (existingGalleryImages && existingGalleryImages.length > 0) {
    existingGalleryImages.forEach((fileName) => {
      formData.append("existingGalleryImages", fileName);
    });
  }

  const response = await apiRequest<WorldItem>(`/world-items/${itemId}`, {
    method: "PATCH",
    body: formData,
  });

  return response.id;
}

export async function deleteItem(itemId: string): Promise<boolean> {
  await apiRequest(`/world-items/${itemId}`, { method: "DELETE" });
  return true;
}

export async function getWorldById(
  worldId: string
): Promise<WorldEntity | null> {
  if (!worldId) return null;
  return apiRequest<WorldEntity>(`/worlds/${worldId}`);
}

export async function getAllWorlds(search?: string): Promise<WorldEntity[]> {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const response = await apiRequest<{ data: WorldEntity[] }>(`/worlds${query}`);
  return response?.data ?? [];
}

export async function getMyWorlds(): Promise<WorldEntity[]> {
  return apiRequest<WorldEntity[]>(`/worlds/mine`);
}

export async function createNewWorld(
  data: Partial<WorldEntity>,
  imageFile?: File | null
): Promise<string> {
  const formData = new FormData();

  formData.append("name", data.name || "New Realm");
  formData.append("description", data.description || "");
  formData.append("type", data.type || "");
  formData.append("era", data.era || "");
  formData.append("themes", data.themes || "");
  formData.append("startingRegion", data.starting_region || "");

  if (Array.isArray(data.contributors)) {
    data.contributors.forEach((email) => {
      formData.append("contributors", email);
    });
  }

  formData.append("isPublic", String(data.isPublic ?? false));

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const response = await apiRequest<WorldEntity>(`/worlds`, {
    method: "POST",
    body: formData,
  });

  return response.id;
}

export async function checkUserExistsByEmail(email: string): Promise<boolean> {
  console.log(`[API Call]: Checking user existence for email: ${email}`);

  try {
    const response = await fetch(
      `${API_BASE}/users/check-existence?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer YOUR_AUTH_TOKEN_HERE",
        },
      }
    );

    if (!response.ok) {
      console.error(`Error checking user existence: ${response.status}`);
      if (response.status === 404) return false;
      throw new Error("Failed to check user existence on server.");
    }

    const result = await response.json();

    return result.exists === true;
  } catch (error) {
    console.error("Network or parsing error during user check:", error);
    return false;
  }
}

export async function updateWorldMetadata(
  worldId: string,
  data: Partial<WorldEntity>,
  imageFile?: File | null
): Promise<void> {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.type) formData.append("type", data.type);
  if (data.era) formData.append("era", data.era);
  if (data.themes) formData.append("themes", data.themes);

  if (data.starting_region)
    formData.append("startingRegion", data.starting_region);

  if (
    data.contributors &&
    Array.isArray(data.contributors) &&
    data.contributors.length > 0
  ) {
    data.contributors.forEach((email) => {
      formData.append("contributors", email);
    });
  }

  if (data.isPublic !== undefined) {
    formData.append("isPublic", String(data.isPublic));
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  await apiRequest(`/worlds/${worldId}`, {
    method: "PATCH",
    body: formData,
  });
}

export async function deleteWorld(worldId: string): Promise<void> {
  await apiRequest(`/worlds/${worldId}`, { method: "DELETE" });
}
