import { WorldItem, WorldEntity, CharacterItem } from "./types";

export const WORLD_METADATA_KEY = "WORLDS_METADATA_V1";
export const STORAGE_KEY = "WORLD_DATA_V1";

export const INITIAL_WORLD_METADATA: WorldEntity[] = [
  {
    id: "elarian-skies",
    name: "Elarian Skies",
    description:
      "Suspended between the heavens and the abyss. A realm of floating citadels and sentient storms.",
    contributors: "Lady Elowyn, Arcanist Veyl",
    type: "High Fantasy",
    era: "The Age of Ascension",
    themes: "Sky piracy, Ancient pacts, Elemental conflict",
    starting_region: "Aetherwind Bay",
    visibility: true, // Публічний світ
  },
  {
    id: "verdant-hollow",
    name: "Verdant Hollow",
    description:
      "Bioluminescent forests rooted in ancient leviathans. A world hidden from the sky.",
    contributors: "Quinn Cartographer",
    type: "Dark Fantasy",
    era: "The Whispering Age",
    themes: "Bioluminescence, Ancient technology, Isolation",
    starting_region: "The Sunken Root",
    visibility: false, // Приватний світ
  },
];

export const INITIAL_MOCKED_DATA: WorldItem[] = [
  // Characters
  {
    id: "char-1",
    name: "Captain Elowyn Stratus",
    role: "Aetherwind privateer",
    faction: "Skybound Covenant", // 👈 Додано обов'язкове поле
    status: "active", // 👈 Додано обов'язкове поле (якщо не успадковано)
    description: "A pragmatic but honorable captain.", // 👈 Додано обов'язкове поле
    motivations: "Protect her crew.", // 👈 Додано обов'язкове поле
    type: "characters",
  } as CharacterItem,
  {
    id: "char-2",
    name: "Arcanist Veyl",
    role: "Keeper of archives",
    faction: "Tempest Choir",
    status: "passive",
    description: "Obsessed with ley lines and ancient pacts.",
    motivations: "Unravel the truth of the First Gale.",
    type: "characters",
  } as CharacterItem,

  // Continents
  {
    id: "cont-1",
    worldId: "elarian-skies",
    name: "Sapphirine Isles",
    detail: "Floating archipelago",
    type: "continents",
  },
  {
    id: "cont-2",
    worldId: "elarian-skies",
    name: "Verdant Hollow",
    detail: "Bioluminescent forests",
    type: "continents",
  },

  // Quests (використовує універсальні поля status та hook)
  {
    id: "quest-1",
    worldId: "elarian-skies",
    name: "The Tempest Choir",
    status: "In Motion", // ✅ Дозволено WorldItem
    hook: "Negotiate peace", // ✅ Дозволено WorldItem
    type: "quests",
  },
  {
    id: "quest-2",
    worldId: "elarian-skies",
    name: "Shards of the Primordial",
    status: "Rumored",
    hook: "Gather relics",
    type: "quests",
  },

  // Regions
  {
    id: "reg-1",
    worldId: "elarian-skies",
    name: "Shattered Peaks",
    detail: "Home to nomadic sky tribes",
    type: "regions",
  },

  // Locations
  {
    id: "loc-1",
    worldId: "elarian-skies",
    name: "Obsidian Spire",
    detail: "Ancient tower",
    type: "locations",
  },

  // Factions
  {
    id: "fact-1",
    worldId: "elarian-skies",
    name: "Aetherwind Traders",
    detail: "Mercantile guild",
    type: "factions",
  },

  // Artifacts
  {
    id: "art-1",
    worldId: "elarian-skies",
    name: "Compass of the Void",
    detail: "Celestial tear locator",
    type: "artifacts",
  },

  // Timelines
  {
    id: "time-1",
    worldId: "elarian-skies",
    name: "Era of Drakes",
    detail: "Draconic dominance",
    type: "timelines",
  },
];
