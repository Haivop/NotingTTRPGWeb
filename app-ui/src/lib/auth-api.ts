// src/lib/auth-api.ts

import { UserEntity } from "./types"; // 👈 Припускаємо, що UserEntity імпортовано з types.ts

// --- КОНСТАНТИ ТА ДАНІ ---
const AUTH_STATUS_KEY = "APP_AUTH_STATUS";
export const CURRENT_USER_KEY = "CURRENT_USER_ID";

export type AuthStatus = "loading" | "guest" | "user";

const simulateDelay = (ms = 50) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Тестові дані користувача
const TEST_USER_ID = "user-0001";
const TEST_USER_DATA: UserEntity = {
  id: TEST_USER_ID,
  username: "Archivist Test",
};

// --- 1. ФУНКЦІЇ LOCAL STORAGE ---

function getStoredUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CURRENT_USER_KEY);
}

function setStoredUserId(id: string | null): void {
  if (typeof window !== "undefined") {
    if (id) {
      localStorage.setItem(CURRENT_USER_KEY, id);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }
}

// --- 2. ФУНКЦІЇ API (ПРИВ'ЯЗАНІ ДО LOCAL STORAGE) ---

/**
 * Отримує поточний стійкий статус користувача (User Entity).
 */
export async function getCurrentAuthStatus(): Promise<UserEntity | null> {
  await simulateDelay();
  const userId = getStoredUserId();

  if (userId === TEST_USER_ID) {
    return TEST_USER_DATA;
  }
  return null;
}

/**
 * Вхід користувача (Login). Зберігає ID користувача в LS.
 */
export async function signInUser(): Promise<UserEntity> {
  await simulateDelay();
  setStoredUserId(TEST_USER_ID); // ✅ ЗБЕРЕЖЕННЯ ID
  return TEST_USER_DATA;
}

/**
 * Вихід користувача (Logout). Очищає ID у сховищі.
 */
export async function signOutUser(): Promise<void> {
  await simulateDelay();
  setStoredUserId(null); // ✅ ОЧИЩЕННЯ ID
}
