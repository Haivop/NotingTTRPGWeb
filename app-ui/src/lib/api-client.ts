'use client';

import { cacheUser, clearSession, getAccessToken, getRefreshToken, setSession } from './token-storage';
import { UserEntity } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4001/api';

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = RequestInit & { auth?: boolean };

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await safeParse(response);
    if (!response.ok) {
      clearSession();
      return false;
    }

    const { tokens, user } = data as { tokens: { accessToken: string; refreshToken: string }; user: UserEntity };
    setSession(tokens, user);
    if (user) {
      cacheUser(user);
    }
    return true;
  } catch (error) {
    console.error('Failed to refresh access token', error);
    clearSession();
    return false;
  }
}

async function safeParse(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (error) {
    console.error('Failed to parse response', error);
    return null;
  }
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const { auth = true, headers, body, ...rest } = options;
  const resolvedHeaders = new Headers(headers ?? {});

  if (body && !resolvedHeaders.has('Content-Type')) {
    resolvedHeaders.set('Content-Type', 'application/json');
  }

  let token = getAccessToken();
  if (auth && token) {
    resolvedHeaders.set('Authorization', `Bearer ${token}`);
  }

  let response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: resolvedHeaders,
    body,
  });

  if (response.status === 401 && auth && (await refreshAccessToken())) {
    token = getAccessToken();
    if (token) {
      resolvedHeaders.set('Authorization', `Bearer ${token}`);
    } else {
      resolvedHeaders.delete('Authorization');
    }

    response = await fetch(`${API_BASE_URL}${path}`, {
      ...rest,
      headers: resolvedHeaders,
      body,
    });
  }

  const data = await safeParse(response);
  if (!response.ok) {
    const message = (data as { message?: string })?.message || 'Request failed';
    throw new ApiError(message, response.status, data);
  }

  return data as T;
}
