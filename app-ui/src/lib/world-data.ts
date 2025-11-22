"use client";

import { apiRequest } from "./api-client";
import { ItemFormData, WorldEntity, WorldItem } from "./types";

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
  // 👇 Тип даних: це ОБ'ЄКТ, а не FormData.
  data: ItemFormData | Partial<WorldItem>,
  imageFile?: File | null,
  galleryFiles?: File[]
): Promise<string> {
  const formData = new FormData();

  // 👇 ВИПРАВЛЕННЯ ТУТ:
  // Ми витягуємо властивість 'name', а решту кладемо в 'rest'
  const { name, ...rest } = data;

  // Гарантуємо, що name - це рядок (або дефолтне значення)
  const itemName = name || "Unnamed Item";

  // 1. Додаємо основні поля
  formData.append("type", type);
  formData.append("name", itemName);

  // 2. payload - це все, що залишилося (rest)
  formData.append("payload", JSON.stringify(rest));

  // 3. Головне фото
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // 4. Галерея
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
  data: Partial<WorldEntity>,
  imageFile?: File | null // 🆕 Додано опціональний файл
): Promise<string> {
  // Створюємо FormData
  const formData = new FormData();

  // Додаємо всі текстові поля
  formData.append("name", data.name || "New Realm");
  formData.append("description", data.description || "");
  formData.append("type", data.type || "");
  formData.append("era", data.era || "");
  formData.append("themes", data.themes || "");
  formData.append("startingRegion", data.starting_region || "");
  formData.append("contributors", data.contributors || "");

  // ВАЖЛИВО: Перетворюємо boolean на string.
  // Завдяки нашому @Transform в DTO бекенд це зрозуміє.
  formData.append("isPublic", String(data.isPublic ?? false));

  // 🆕 Якщо є файл, додаємо його під ключем 'image' (або як очікує бекенд, наприклад 'file')
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // Відправка
  // ⚠️ ВАЖЛИВО: Коли використовуємо FormData, НЕ МОЖНА вручну ставити Content-Type: application/json
  // fetch/browser сам виставить правильний Content-Type з boundary

  const response = await apiRequest<WorldEntity>(`/worlds`, {
    method: "POST",
    // body: JSON.stringify(...) <--- ЦЕ МИ ПРИБИРАЄМО
    body: formData, // <--- ТЕПЕР ТУТ FormData
  });

  console.log("🔍 FormData isPublic:", formData.get("isPublic"));

  // 2. Або (найкращий спосіб) вивести ВЕСЬ вміст форми, щоб переконатися у всьому
  console.log("--- FormData Content ---");
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  console.log("------------------------");

  return response.id;
}

export async function updateWorldMetadata(
  worldId: string,
  data: Partial<WorldEntity>,
  imageFile?: File | null // 🆕 1. Додали аргумент для файлу
): Promise<void> {
  // 🆕 2. Використовуємо FormData замість JSON
  const formData = new FormData();

  // --- Додаємо текстові поля, тільки якщо вони є ---
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.type) formData.append("type", data.type);
  if (data.era) formData.append("era", data.era);
  if (data.themes) formData.append("themes", data.themes);

  // Мапінг: starting_region (фронт) -> startingRegion (бек)
  if (data.starting_region)
    formData.append("startingRegion", data.starting_region);

  if (data.contributors) formData.append("contributors", data.contributors);

  // --- Логіка для isPublic ---
  // Перевіряємо строго на undefined, щоб не пропустити значення false
  if (data.isPublic !== undefined) {
    formData.append("isPublic", String(data.isPublic));
  }

  // --- Логіка для Зображення ---
  // 🆕 3. Якщо файл передано, додаємо його
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // --- Відправка ---
  await apiRequest(`/worlds/${worldId}`, {
    method: "PATCH",
    body: formData, // ⚠️ Браузер сам встановить Content-Type: multipart/form-data
  });
}

export async function deleteWorld(worldId: string): Promise<void> {
  await apiRequest(`/worlds/${worldId}`, { method: "DELETE" });
}
