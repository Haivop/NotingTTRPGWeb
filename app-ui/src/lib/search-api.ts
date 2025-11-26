"use client";

import { apiRequest } from "./api-client";

export interface SearchWorldResult {
  id: string;
  name: string;
  description: string;
  tags: string[];
  updatedAt?: string;
}

export interface SearchItemResult {
  id: string;
  worldId: string;
  worldName?: string;
  type: string;
  name: string;
  snippet?: string;
  imageUrl?: string;
  updatedAt?: string;
}

export interface SearchResponse {
  query: string;
  worlds: SearchWorldResult[];
  items: SearchItemResult[];
}

export async function searchArchives(
  query: string,
  type?: string,
  signal?: AbortSignal,
): Promise<SearchResponse> {
  const params = new URLSearchParams();
  if (query) {
    params.set("q", query);
  }
  if (type) {
    params.set("type", type);
  }

  const suffix = params.toString();
  const path = suffix ? `/search?${suffix}` : "/search";

  return apiRequest<SearchResponse>(path, { auth: false, signal });
}
