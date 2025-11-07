"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
// 💡 Припускаємо, що UserEntity імпортується з files/types:
import { UserEntity } from "@/lib/types";
import {
  getCurrentAuthStatus,
  signInUser,
  signOutUser,
  AuthStatus, // 'loading', 'guest', 'user'
} from "@/lib/auth-api";

// --- I. ЛОГІКА СТАНУ ---
function useAuthLogic() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  // 🏆 1. ДОДАНО: Стан для зберігання об'єкта користувача
  const [user, setUser] = useState<UserEntity | null>(null); // Завантаження статусу при монтуванні (імітація перевірки сесії)

  useEffect(() => {
    // getCurrentAuthStatus тепер повертає UserEntity | null
    getCurrentAuthStatus().then((userProfile: UserEntity | null) => {
      if (userProfile) {
        setStatus("user");
        setUser(userProfile); // ✅ ЗБЕРІГАЄМО ОБ'ЄКТ
      } else {
        setStatus("guest");
        setUser(null);
      }
    });
  }, []);

  const login = async () => {
    setStatus("loading");
    // signInUser тепер повертає UserEntity
    const userProfile = await signInUser();
    setUser(userProfile); // ✅ ЗБЕРІГАЄМО
    setStatus("user");
  };

  const logout = async () => {
    setStatus("loading");
    await signOutUser(); // signOutUser очищає сховище
    setUser(null); // ✅ ОЧИЩУЄМО
    setStatus("guest");
  };

  return {
    isLoggedIn: status === "user",
    isLoading: status === "loading",
    user, // 🏆 2. ПОВЕРТАЄМО ОБ'ЄКТ КОРИСТУВАЧА
    login,
    logout,
    status,
  };
}
// --- II. КОНТЕКСТ ТА ПРОВАЙДЕР ---

type AuthContextType = ReturnType<typeof useAuthLogic>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Провайдер, який обгортає додаток
export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const authState = useAuthLogic();

  // В ідеалі, тут можна показати спінер, якщо authState.isLoading.
  // Наразі ми просто рендеримо дітей.

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

// Хук для споживання стану автентифікації в будь-якому компоненті
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
