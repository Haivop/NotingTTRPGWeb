// src/components/layout/AuthHeaderWrapper.tsx
"use client";

import React from "react";
import { SiteHeader, SiteHeaderProps } from "./SiteHeader";
import { useAuth } from "@/components/layout/AuthContext"; // 👈 Імпорт Context Hook

// Визначаємо пропси обгортки (вона не вимагає isLoggedIn, бо додає його сама)
type AuthWrapperProps = Omit<SiteHeaderProps, "isLoggedIn">;

export function AuthHeaderWrapper(props: AuthWrapperProps) {
  const { isLoggedIn, isLoading } = useAuth();

  // 🏆 ВИПРАВЛЕННЯ ПОМИЛКИ ГІДРАТАЦІЇ:
  // Під час першого завантаження (коли isLoading: true) ми передаємо false до SiteHeader.
  // Це відповідає значенню на сервері та запобігає невідповідності.
  const finalIsLoggedIn = isLoading ? false : isLoggedIn;

  return <SiteHeader {...props} />;
}
