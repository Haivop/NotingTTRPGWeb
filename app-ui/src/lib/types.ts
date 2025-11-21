// --- БАЗОВИЙ УНІВЕРСАЛЬНИЙ ІНТЕРФЕЙС ---
export interface WorldItem {
  id: string;
  worldId: string;
  name: string;
  type: string; // 'characters', 'quests', 'continents', 'locations', 'factions', etc.
  detail?: string;

  // Універсальні поля, які можуть бути у Quest, Character, Artifact
  status?: string;
  hook?: string;
}

// --- СПЕЦІАЛІЗОВАНІ ІНТЕРФЕЙСИ ---

// 1. Інтерфейс для персонажа (Character)
export interface CharacterItem extends WorldItem {
  role: string;
  faction: string;
  description: string;
  motivations: string;
  // status - успадковано, але тут обов'язкові поля Character
}

export interface ContinentItem extends WorldItem {
  // name, detail, type успадковано
  faction?: string; // Можливість прив'язати локацію до фракції
  location_type: string; // "Type" у макеті
  description: string;
}

export interface RegionItem extends WorldItem {
  // name, detail, type успадковано
  faction?: string; // Можливість прив'язати локацію до фракції
  location_type: string; // "Type" у макеті
  description: string;
}

// 2. Інтерфейс для Локації (Location)
// На основі макета Location (image_deec3a.png)
export interface LocationItem extends WorldItem {
  // name, detail, type успадковано
  faction?: string; // Можливість прив'язати локацію до фракції
  location_type: string; // "Type" у макеті
  description: string;
}

// 3. Інтерфейс для Фракції (Faction)
// На основі макета Faction (image_deef02.png)
export interface FactionItem extends WorldItem {
  // name, detail, type успадковано
  description: string;
  // Ми не додаємо 'characters_in_faction' як поле даних, оскільки це пов'язані сутності,
  // які краще вирішувати через функцію пошуку (getItemsByType, фільтруючи за faction: factionId)
}

// 4. Інтерфейс для Квесту (Quest)
// На основі макета Quest (image_deef25.png)
export interface QuestItem extends WorldItem {
  // name, status, type успадковано
  reward: string;
  objective: string;
  description: string;
  // hook - успадковано
}

export interface ArtifactItem extends WorldItem {
  // name, detail, type успадковано
  in_possession_of?: string; // "In Possession of" у макеті (Character ID)
  description: string;
}

// 6. Інтерфейс для Події (Event)
// На основі макета Event (image_def682.png)
export interface TimelineItem extends WorldItem {
  description: string;
}

// 6. Інтерфейс для Події (Event)
// На основі макета Event (image_def682.png)
export interface EventItem extends WorldItem {
  // name, detail, type успадковано
  timeline_group: string; // "Timeline Group" у макеті
  description: string;
}

export interface ItemFormData {
  name: string;

  // Character fields
  faction?: string;
  role?: string;
  motivations?: string;

  // Location/Quest/Faction/Artifact/Event fields
  description?: string;

  // Location field
  location_type?: string;

  // Quest fields
  reward?: string;
  objective?: string;

  // Artifact field 🏆 НОВЕ
  in_possession_of?: string;

  // Event field 🏆 НОВЕ
  timeline_group?: string;

  // Universal fields
  status?: string;
  detail?: string;
  hook?: string;
}

export interface WorldEntity {
  id: string;
  authorId: string;
  name: string;
  description: string;
  contributors: string;
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
