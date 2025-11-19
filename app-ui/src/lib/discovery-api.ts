const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4001/api";

async function fetchJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, init);
  if (!response.ok) {
    throw new Error(`Failed to load ${path}: ${response.status}`);
  }
  return response.json();
}

export interface HomeHero {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}

export interface SpotlightWorld {
  id: string;
  name: string;
  description: string;
  summary: string;
  updatedAt?: string;
}

export interface HomeDiscoveryPayload {
  hero: HomeHero;
  features: { title: string; description: string }[];
  spotlightWorlds: SpotlightWorld[];
}

export interface HubStats {
  worlds: number;
  [key: string]: number;
}

export interface HubEvent {
  title: string;
  description: string;
}

export interface HubUpdate {
  id: string;
  name: string;
  summary: string;
  updatedAt?: string;
}

export interface HubDiscoveryPayload {
  stats: HubStats;
  featuredWorlds: SpotlightWorld[];
  liveUpdates: HubUpdate[];
  events: HubEvent[];
}

export async function getHomeDiscoveryData(): Promise<HomeDiscoveryPayload> {
  return fetchJson<HomeDiscoveryPayload>("/discovery/home", { cache: "no-store" });
}

export async function getHubDiscoveryData(): Promise<HubDiscoveryPayload> {
  return fetchJson<HubDiscoveryPayload>("/discovery/hub", { cache: "no-store" });
}
