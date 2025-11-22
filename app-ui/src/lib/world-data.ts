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

  // Додаємо всі прості текстові поля
  formData.append("name", data.name || "New Realm");
  formData.append("description", data.description || "");
  formData.append("type", data.type || "");
  formData.append("era", data.era || "");
  formData.append("themes", data.themes || "");
  formData.append("startingRegion", data.starting_region || "");

  // 1. 🆕 ОБРОБКА СПІВАВТОРІВ (як масив рядків)
  // TypeScript допоможе, якщо ви визначили `data.contributors` як `string[]`.
  if (Array.isArray(data.contributors)) {
    data.contributors.forEach((email) => {
      // Для передачі масиву через FormData кожен елемент додається окремим полем
      formData.append("contributors", email);
    });
  }

  // ВАЖЛИВО: Перетворюємо boolean на string.
  formData.append("isPublic", String(data.isPublic ?? false));

  // Якщо є файл, додаємо його під ключем 'image'
  if (imageFile) {
    formData.append("image", imageFile);
  }

  // ... (логіка відправки та логування без змін)

  const response = await apiRequest<WorldEntity>(`/worlds`, {
    method: "POST",
    body: formData,
  });

  console.log("🔍 FormData isPublic:", formData.get("isPublic"));

  // 2. Або (найкращий спосіб) вивести ВЕСЬ вміст форми, щоб переконатися у всьому
  console.log("--- FormData Content ---");
  for (const pair of formData.entries()) {
    // 💡 Примітка: Для файлів тут буде виведено [object File]
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  console.log("------------------------");

  return response.id;
}

/**
 * 🆕 Функція для перевірки, чи існує користувач за email.
 * Ця функція має викликати API-маршрут на вашому бекенді.
 * @param email Пошта для перевірки
 * @returns true, якщо користувач існує, false — якщо ні.
 */
export async function checkUserExistsByEmail(email: string): Promise<boolean> {
  // ❗️ ЗАМІНІТЬ ЦЕЙ КОД НА РЕАЛЬНИЙ ВИКЛИК ДО ВАШОГО БЕКЕНДУ!

  console.log(`[API Call]: Checking user existence for email: ${email}`);

  try {
    // Приклад виклику: GET /api/users/check?email=test@example.com
    const response = await fetch(
      `${API_BASE}/users/check-existence?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          // Замініть на свій механізм аутентифікації (наприклад, JWT)
          Authorization: "Bearer YOUR_AUTH_TOKEN_HERE",
        },
      }
    );

    if (!response.ok) {
      // Якщо сталася помилка сервера (4xx, 5xx)
      console.error(`Error checking user existence: ${response.status}`);
      // Можемо припустити, що користувач не знайдений, якщо це 404
      if (response.status === 404) return false;
      throw new Error("Failed to check user existence on server.");
    }

    const result = await response.json();

    // Припустимо, що ваш бекенд повертає об'єкт { exists: true | false }
    return result.exists === true;
  } catch (error) {
    console.error("Network or parsing error during user check:", error);
    // Повертаємо false, щоб не дозволити додати пошту при помилці
    return false;
  }

  // ⚠️ Тимчасова заглушка для тестування без бекенда:
  // if (email.includes("@")) {
  //   // Уявімо, що пошта 'test@found.com' існує, а решта – ні.
  //   return email === 'test@found.com';
  // }
  // return false;
}

export async function updateWorldMetadata(
  worldId: string,
  data: Partial<WorldEntity>,
  imageFile?: File | null // 1. Додали аргумент для файлу
): Promise<void> {
  // 2. Використовуємо FormData замість JSON
  const formData = new FormData();

  // --- Додаємо прості текстові поля, тільки якщо вони є ---
  if (data.name) formData.append("name", data.name);
  if (data.description) formData.append("description", data.description);
  if (data.type) formData.append("type", data.type);
  if (data.era) formData.append("era", data.era);
  if (data.themes) formData.append("themes", data.themes);

  // Мапінг: starting_region (фронт) -> startingRegion (бек)
  if (data.starting_region)
    formData.append("startingRegion", data.starting_region);

  if (
    data.contributors &&
    Array.isArray(data.contributors) &&
    data.contributors.length > 0
  ) {
    // Тільки якщо є елементи, відправляємо їх
    data.contributors.forEach((email) => {
      formData.append("contributors", email);
    });
  }

  // --- Логіка для isPublic ---
  // Перевіряємо строго на undefined, щоб не пропустити значення false
  if (data.isPublic !== undefined) {
    formData.append("isPublic", String(data.isPublic));
  }

  // --- Логіка для Зображення ---
  // 3. Якщо файл передано, додаємо його
  if (imageFile) {
    formData.append("image", imageFile);
  }

  console.log("--- FormData Content for PATCH ---");
  for (const pair of formData.entries()) {
    console.log(`${pair[0]}: ${pair[1]}`);
  }
  console.log("----------------------------------");

  // --- Відправка ---
  await apiRequest(`/worlds/${worldId}`, {
    method: "PATCH",
    body: formData, // Браузер сам встановить Content-Type: multipart/form-data
  });
}

export async function deleteWorld(worldId: string): Promise<void> {
  await apiRequest(`/worlds/${worldId}`, { method: "DELETE" });
}
