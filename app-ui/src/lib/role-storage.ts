'use client';

import { Role } from './types';

const ROLE_KEY = 'userRole';

export const getRole = (): Role | null => {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem(ROLE_KEY);
    return role as Role | null;
  }
  return null;
};

export const setRole = (role: Role) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(ROLE_KEY, role);
  }
};