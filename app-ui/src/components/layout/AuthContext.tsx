"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { UserEntity, Role } from "@/lib/types";
import {
  getCurrentAuthStatus,
  signInUser,
  signOutUser,
  AuthStatus,
} from "@/lib/auth-api";
import { getRole, setRole } from "@/lib/role-storage";

function useAuthLogic() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserEntity | null>(null);
  const [role, setRoleState] = useState<Role | null>(null);

  useEffect(() => {
    getCurrentAuthStatus().then((userProfile: UserEntity | null) => {
      if (userProfile) {
        setStatus("user");
        setUser(userProfile);
        const storedRole = getRole();
        if (storedRole) {
          setRoleState(storedRole);
        } else {
          // Якщо роль не встановлена, за замовчуванням гість
          setRole("Guest");
          setRoleState("Guest");
        }
      } else {
        setStatus("guest");
        setUser(null);
        setRoleState(null);
      }
    });
  }, []);

  const login = async () => {
    setStatus("loading");
    const userProfile = await signInUser();
    setUser(userProfile);
    setStatus("user");
    // Встановлюємо роль за замовчуванням при вході
    setRole("Author");
    setRoleState("Author");
  };

  const logout = async () => {
    setStatus("loading");
    await signOutUser();
    setUser(null);
    setStatus("guest");
    setRoleState(null);
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    setRoleState(newRole);
    console.log("Role switched to:", newRole);
  };

  return {
    isLoggedIn: status === "user",
    isLoading: status === "loading",
    user,
    role,
    login,
    logout,
    status,
    switchRole,
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
