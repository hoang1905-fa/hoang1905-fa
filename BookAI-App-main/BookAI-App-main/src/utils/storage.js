import { STORAGE_KEY } from "./constants";

export const loadFromStorage = async (fallback) => {
  try {
    const r = localStorage.getItem(STORAGE_KEY);
    if (r) return JSON.parse(r);
  } catch (_) {}
  return fallback;
};

export const saveToStorage = async (data) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch (_) {}
};