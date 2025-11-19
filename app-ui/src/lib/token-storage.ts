'use client';

import { UserEntity } from './types';

const ACCESS_TOKEN_KEY = 'WORLDCRAFTERY_ACCESS_TOKEN';
const REFRESH_TOKEN_KEY = 'WORLDCRAFTERY_REFRESH_TOKEN';
const USER_CACHE_KEY = 'WORLDCRAFTERY_USER_PROFILE';

const isBrowser = () => typeof window !== 'undefined';

export function getAccessToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (!isBrowser()) return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function cacheUser(user: UserEntity) {
  if (!isBrowser()) return;
  localStorage.setItem(USER_CACHE_KEY, JSON.stringify(user));
}

export function getCachedUser(): UserEntity | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(USER_CACHE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserEntity;
  } catch (error) {
    console.error('Failed to parse cached user', error);
    return null;
  }
}

export function setSession(tokens: { accessToken: string; refreshToken: string }, user?: UserEntity) {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  if (user) {
    cacheUser(user);
  }
}

export function clearSession() {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_CACHE_KEY);
}
