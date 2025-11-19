"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { UserEntity } from "@/lib/types";
import {
  AuthStatus,
  getCurrentAuthStatus,
  LoginPayload,
  registerUser,
  RegistrationPayload,
  signInUser,
  signOutUser,
} from "@/lib/auth-api";

function useAuthLogic() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<UserEntity | null>(null);

  useEffect(() => {
    getCurrentAuthStatus().then((userProfile: UserEntity | null) => {
      if (userProfile) {
        setStatus("user");
        setUser(userProfile);
      } else {
        setStatus("guest");
        setUser(null);
      }
    });
  }, []);

  const login = async (payload: LoginPayload) => {
    setStatus("loading");
    try {
      const userProfile = await signInUser(payload);
      setUser(userProfile);
      setStatus("user");
    } catch (error) {
      setStatus("guest");
      setUser(null);
      throw error;
    }
  };

  const register = async (payload: RegistrationPayload) => {
    setStatus("loading");
    try {
      const userProfile = await registerUser(payload);
      setUser(userProfile);
      setStatus("user");
    } catch (error) {
      setStatus("guest");
      setUser(null);
      throw error;
    }
  };

  const logout = async () => {
    setStatus("loading");
    await signOutUser();
    setUser(null);
    setStatus("guest");
  };

  const refreshUser = async () => {
    const profile = await getCurrentAuthStatus();
    if (profile) {
      setUser(profile);
      setStatus("user");
    } else {
      setUser(null);
      setStatus("guest");
    }
  };

  return {
    isLoggedIn: status === "user",
    isLoading: status === "loading",
    user,
    login,
    register,
    logout,
    status,
    refreshUser,
  };
}

type AuthContextType = ReturnType<typeof useAuthLogic>;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthContextProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthLogic();
  return <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
}
