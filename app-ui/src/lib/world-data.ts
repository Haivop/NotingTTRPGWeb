"use client";

import { apiRequest } from "./api-client";
import { WorldEntity, WorldItem } from "./types";

export type { WorldEntity, WorldItem, ItemFormData } from "./types";

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
  data: Partial<WorldItem>
): Promise<string> {
  const payload = buildPayload(data);
  const response = await apiRequest<WorldItem>(`/worlds/${worldId}/items`, {
    method: "POST",
    body: JSON.stringify({
      type,
      name: data.name || "Unnamed Item",
      payload,
    }),
  });
  return response.id;
}

export async function updateItem(
  itemId: string,
  data: Partial<WorldItem>
): Promise<string> {
  const payload = buildPayload(data);
  const response = await apiRequest<WorldItem>(`/world-items/${itemId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: data.name,
      payload,
    }),
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
  data: Partial<WorldEntity>
): Promise<string> {
  const response = await apiRequest<WorldEntity>(`/worlds`, {
    method: "POST",
    body: JSON.stringify({
      name: data.name || "New Realm",
      description: data.description || "",
      type: data.type || "",
      era: data.era || "",
      themes: data.themes || "",
      startingRegion: data.starting_region || "",
      contributors: data.contributors || "",
      isPublic: data.isPublic ?? false,
    }),
  });
  return response.id;
}

export async function updateWorldMetadata(
  worldId: string,
  data: Partial<WorldEntity>
): Promise<void> {
  await apiRequest(`/worlds/${worldId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: data.name,
      description: data.description,
      type: data.type,
      era: data.era,
      themes: data.themes,
      startingRegion: data.starting_region,
      contributors: data.contributors,
      isPublic: data.isPublic,
    }),
  });
}

export async function deleteWorld(worldId: string): Promise<void> {
  await apiRequest(`/worlds/${worldId}`, { method: "DELETE" });
}
