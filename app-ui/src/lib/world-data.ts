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
  name: string;
  description: string;
  contributors: string;
  type: string;
  era: string;
  themes: string;
  starting_region: string;
  visibility: boolean;
}

const WORLD_METADATA_KEY = "WORLDS_METADATA_V1";

const INITIAL_WORLD_METADATA: WorldEntity[] = [
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

const STORAGE_KEY = "WORLD_DATA_V1";

const INITIAL_MOCKED_DATA: WorldItem[] = [
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

// --- Функції Local Storage ---

/**
 * Завантажує дані з LS. Якщо порожньо, ініціалізує мокованими даними.
 */
function initializeAndLoadData(): WorldItem[] {
  if (typeof window === "undefined") return INITIAL_MOCKED_DATA; // На сервері

  let data;
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (serialized) {
      data = JSON.parse(serialized);
    }
  } catch (e) {
    console.error("Error loading data from localStorage:", e);
  }

  if (!data || data.length === 0) {
    // Якщо даних немає, завантажуємо моковані дані та зберігаємо
    saveData(INITIAL_MOCKED_DATA);
    return INITIAL_MOCKED_DATA;
  }
  return data;
}

/**
 * Зберігає весь масив даних у LS.
 */
function saveData(data: WorldItem[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }
}

// --- Асинхронні функції API ---

const simulateDelay = (ms = 50) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Універсальна функція для отримання елементів певного типу.
 */
export async function getItemsByType(
  worldId: string, // ✅ Цей аргумент тепер використовується
  type: string
): Promise<WorldItem[]> {
  await simulateDelay();

  const allData = initializeAndLoadData();

  // 🏆 ФІЛЬТРАЦІЯ ЗА ДВОМА УМОВАМИ
  const items = allData.filter(
    (item) => item.type === type && item.worldId === worldId
  );

  console.log(
    `[LS API] Fetched ${items.length} items for World: ${worldId}, Type: ${type}`
  );
  return items;
}

/**
 * Отримує один елемент за його унікальним ID.
 * @param itemId Унікальний ID об'єкта (наприклад, 'char-1').
 * @returns WorldItem або null, якщо не знайдено.
 */
export async function getItemById(itemId: string): Promise<WorldItem | null> {
  await simulateDelay();

  // 1. Завантажуємо всі дані з Local Storage
  const allData = initializeAndLoadData();

  // 🏆 КРИТИЧНА ПЕРЕВІРКА: ЧИ ВИКОРИСТОВУЄТЬСЯ find() ДЛЯ ФІЛЬТРАЦІЇ?
  const item = allData.find((item) => item.id === itemId); // ✅ Це має бути правильно

  if (item) {
    console.log(`[LS API] Fetched item ID: ${itemId}. Name: ${item.name}`); // Лог для перевірки
  } else {
    console.warn(`[LS API] Item ID not found: ${itemId}`);
  }

  // 2. ПОТЕНЦІЙНА ПОМИЛКА: Якщо ви тут випадково повертаєте allData[0], то це проблема.
  return item || null; // ✅ Має повертатися знайдений елемент або null
}
/**
 * Універсальна функція для збереження нового об'єкта.
 */
export async function saveNewItem(
  worldId: string,
  type: string,
  data: Partial<WorldItem>,
  itemId?: string
): Promise<string> {
  await simulateDelay(200);

  const allData = initializeAndLoadData();
  const finalId = `${type}-${Date.now()}`;

  const newItem: WorldItem = {
    ...data,
    name: data.name || "Unnamed Item",
    type: type, // Забезпечуємо наявність типу
    id: finalId, // Додаємо ID для унікальності
    worldId: worldId,
  } as WorldItem; // Встановлюємо тип

  allData.push(newItem);
  saveData(allData);

  return finalId;
}

// src/services/world-data.ts (Додайте цю функцію)

/**
 * Імітує оновлення існуючого елемента в Local Storage.
 * @param itemId - ID існуючого елемента, який потрібно оновити.
 * @param data - Часткові дані для оновлення.
 * @returns ID оновленого елемента.
 */
export async function updateItem(
  itemId: string,
  data: Partial<WorldItem>
): Promise<string> {
  await simulateDelay(200);

  const allData = initializeAndLoadData();
  const itemIndex = allData.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    console.error(`[LS API] UPDATE FAILED: Item ID ${itemId} not found.`);
    return itemId; // Повертаємо оригінальний ID, але операція не вдалася
  }

  // 1. Оновлюємо властивості існуючого елемента
  allData[itemIndex] = {
    ...allData[itemIndex], // Зберігаємо старі дані
    ...data, // Застосовуємо нові дані з форми
  } as WorldItem;

  // 2. Зберігаємо оновлену колекцію назад у Local Storage
  saveData(allData);

  console.log(`[LS API] Item ID ${itemId} successfully updated.`);

  return itemId; // Повертаємо існуючий ID
}

/**
 * Імітує видалення елемента з Local Storage за його ID.
 * @param itemId - ID елемента, який потрібно видалити.
 * @returns true, якщо елемент було успішно видалено.
 */
export async function deleteItem(itemId: string): Promise<boolean> {
  await simulateDelay(200);

  const allData = initializeAndLoadData();
  // Фільтруємо всі елементи, залишаючи лише ті, чий ID не збігається з itemId
  const updatedData = allData.filter((item) => item.id !== itemId);

  if (updatedData.length === allData.length) {
    console.warn(`[LS API] DELETE FAILED: Item ID ${itemId} not found.`);
    return false;
  }

  // Зберігаємо оновлену колекцію без видаленого елемента
  saveData(updatedData);

  console.log(`[LS API] Item ID ${itemId} successfully deleted.`);
  return true;
}

function initializeAndLoadWorldMetadata(): WorldEntity[] {
  if (typeof window === "undefined") return INITIAL_WORLD_METADATA;

  let data;
  try {
    const serialized = localStorage.getItem(WORLD_METADATA_KEY);
    data = serialized ? JSON.parse(serialized) : [];
  } catch (e) {
    console.error("Error loading world metadata:", e);
  }

  if (!data || data.length === 0) {
    localStorage.setItem(
      WORLD_METADATA_KEY,
      JSON.stringify(INITIAL_WORLD_METADATA)
    );
    return INITIAL_WORLD_METADATA;
  }
  return data;
}

export async function getWorldById(
  worldId: string
): Promise<WorldEntity | null> {
  await simulateDelay();
  const metadata = initializeAndLoadWorldMetadata();
  return metadata.find((world) => world.id === worldId) || null;
}

export async function getAllWorlds(): Promise<WorldEntity[]> {
  await simulateDelay(50);
  return initializeAndLoadWorldMetadata();
}

function saveWorldMetadata(metadata: WorldEntity[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(WORLD_METADATA_KEY, JSON.stringify(metadata));
  }
}

/**
 * Створює новий світ та зберігає його метадані.
 */
export async function createNewWorld(
  data: Partial<WorldEntity>
): Promise<string> {
  await simulateDelay(200);

  const allWorlds = initializeAndLoadWorldMetadata();
  const newWorldId =
    data.name.toLowerCase().replace(/ /g, "-") + "-" + Date.now(); // Генеруємо унікальний slug ID

  const newWorld: WorldEntity = {
    id: newWorldId,
    name: data.name || "Unnamed Realm",
    description: data.description || "No description provided.",

    // Встановлюємо дефолтні значення для обов'язкових полів
    contributors: data.contributors || "",
    type: data.type || "Fantasy",
    era: data.era || "Unknown",
    themes: data.themes || "",
    starting_region: data.starting_region || "",
    visibility: data.visibility || false,
  };

  allWorlds.push(newWorld);
  saveWorldMetadata(allWorlds);

  console.log(`[LS API] New World created: ${newWorldId}`);
  return newWorldId;
}

export async function updateWorldMetadata(
  worldId: string,
  data: Partial<WorldEntity>
): Promise<void> {
  await simulateDelay(200);

  const allWorlds = initializeAndLoadWorldMetadata();
  const index = allWorlds.findIndex((world) => world.id === worldId);

  if (index === -1) {
    console.error(`[LS API] World ID ${worldId} not found for update.`);
    return;
  }

  // Оновлюємо елемент
  allWorlds[index] = {
    ...allWorlds[index],
    ...data,
    id: worldId, // Забезпечуємо збереження ID
    name: data.name || allWorlds[index].name,
  } as WorldEntity;

  saveWorldMetadata(allWorlds);
  console.log(`[LS API] World ${worldId} metadata updated.`);
}

export async function deleteWorld(worldId: string): Promise<void> {
  await simulateDelay(200);

  let allWorlds = initializeAndLoadWorldMetadata();
  const initialLength = allWorlds.length;

  // Фільтруємо світи, залишаючи всі, крім того, що видаляється
  allWorlds = allWorlds.filter((world) => world.id !== worldId);

  if (allWorlds.length === initialLength) {
    console.warn(`[LS API] World ID ${worldId} not found for deletion.`);
  } else {
    saveWorldMetadata(allWorlds);
    console.log(`[LS API] World ${worldId} deleted successfully.`);
  }
}
