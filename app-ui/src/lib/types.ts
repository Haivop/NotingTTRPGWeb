export interface WorldItem {
  id: string;
  worldId: string;
  name: string;
  type: string;
  detail?: string;

  imageUrl?: string;
  galleryImages?: string[];

  status?: string;
  hook?: string;
}

export interface CharacterItem extends WorldItem {
  role: string;
  faction: string;
  description: string;
  motivations: string;
}

export interface ContinentItem extends WorldItem {
  faction?: string;
  location_type: string;
  description: string;
}

export interface RegionItem extends WorldItem {
  faction?: string;
  location_type: string;
  description: string;
}

export interface LocationItem extends WorldItem {
  faction?: string;
  location_type: string;
  description: string;
}

export interface FactionItem extends WorldItem {
  description: string;
}

export interface QuestItem extends WorldItem {
  reward: string;
  objective: string;
  description: string;
}

export interface ArtifactItem extends WorldItem {
  in_possession_of?: string;
  description: string;
}

export interface TimelineItem extends WorldItem {
  description: string;
}

export interface EventItem extends WorldItem {
  timeline_group: string;
  description: string;
}

export interface ItemFormData {
  name: string;

  faction?: string;
  role?: string;
  motivations?: string;

  description?: string;

  location_type?: string;

  reward?: string;
  objective?: string;

  in_possession_of?: string;

  timeline_group?: string;

  status?: string;
  detail?: string;
  hook?: string;
}

export interface WorldEntity {
  id: string;
  authorId: string;
  name: string;
  description: string;
  contributors: string[];
  type: string;
  era: string;
  themes: string;
  starting_region: string;
  isPublic: boolean;
  mapUrl?: string;
  tags?: string[];
  coAuthorIds?: string[];
  updatedAt?: string;
}

export interface UserEntity {
  id: string;
  username: string;
  email: string;
  role?: string;
  createdAt?: string;
}
