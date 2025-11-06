"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import {
  getCurrentAuthStatus,
  signInUser,
  signOutUser,
  AuthStatus,
} from "@/lib/auth-api";

// --- I. ЛОГІКА СТАНУ ---
// Це внутрішній хук, який керує станом
function useAuthLogic() {
  const [status, setStatus] = useState<AuthStatus>("loading");

  // Завантаження статусу при монтуванні (імітація перевірки сесії)
  useEffect(() => {
    getCurrentAuthStatus().then((initialStatus) => {
      setStatus(initialStatus);
    });
  }, []);

  const login = async () => {
    setStatus("loading");
    await signInUser();
    setStatus("user");
  };

  const logout = async () => {
    setStatus("loading");
    await signOutUser();
    setStatus("guest");
  };

  return {
    isLoggedIn: status === "user",
    isLoading: status === "loading",
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
