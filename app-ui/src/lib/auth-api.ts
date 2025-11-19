'use client';

import { apiRequest, ApiError } from './api-client';
import { UserEntity } from './types';
import {
  cacheUser,
  clearSession,
  getAccessToken,
  getCachedUser,
  getRefreshToken,
  setSession,
} from './token-storage';

export type AuthStatus = 'loading' | 'guest' | 'user';

interface AuthResponse {
  user: UserEntity;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface RegistrationPayload {
  username: string;
  email: string;
  password: string;
}

export async function getCurrentAuthStatus(): Promise<UserEntity | null> {
  if (!getAccessToken() && !getRefreshToken()) {
    return null;
  }

  try {
    const user = await apiRequest<UserEntity>('/auth/me');
    cacheUser(user);
    return user;
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      clearSession();
      return null;
    }
    const cached = getCachedUser();
    return cached;
  }
}

export async function signInUser(payload: LoginPayload): Promise<UserEntity> {
  const response = await apiRequest<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
  setSession(response.tokens, response.user);
  cacheUser(response.user);
  return response.user;
}

export async function registerUser(payload: RegistrationPayload): Promise<UserEntity> {
  const response = await apiRequest<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
    auth: false,
  });
  setSession(response.tokens, response.user);
  cacheUser(response.user);
  return response.user;
}

export async function signOutUser(): Promise<void> {
  const refreshToken = getRefreshToken();
  try {
    if (refreshToken) {
      await apiRequest('/auth/logout', {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
      });
    }
  } catch (error) {
    console.warn('Failed to revoke refresh token', error);
  } finally {
    clearSession();
  }
}
