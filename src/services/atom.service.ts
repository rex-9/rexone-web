// src/services/atom.service.ts
import { WritableAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";

class AtomService {
  private atoms: Record<string, WritableAtom<unknown, [unknown], void>> = {};

  constructor() {
    this.loadAtomsFromStorage();
  }

  /**
   * Safely load existing atoms from localStorage.
   * Invalid JSON entries are automatically removed.
   */
  private loadAtomsFromStorage(): void {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return;
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;

      const value = this.safeParse(key);
      if (value !== undefined) {
        this.atoms[key] = atomWithStorage<unknown>(key, value);
      }
    }
  }

  /**
   * Safely parse a localStorage value. Returns undefined if invalid.
   * If invalid, removes the entry and logs a warning.
   */
  private safeParse(key: string): unknown | undefined {
    if (typeof window === "undefined" || typeof localStorage === "undefined") {
      return undefined;
    }

    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : undefined;
    } catch {
      console.warn(`[AtomService] Removed invalid localStorage key: "${key}"`);
      localStorage.removeItem(key);
      return undefined;
    }
  }

  /**
   * Get or create an atom with the given initial value.
   */
  getAtom<T>(key: string, initialValue: T): WritableAtom<T, [T], void> {
    if (!this.atoms[key]) {
      const existing = this.safeParse(key) as T | undefined;
      this.atoms[key] = atomWithStorage<unknown>(
        key,
        existing !== undefined ? existing : initialValue,
      );
    }
    return this.atoms[key] as WritableAtom<T, [T], void>;
  }

  /**
   * Remove an atom and its localStorage entry.
   */
  removeAtom(key: string): void {
    if (this.atoms[key]) {
      if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
        localStorage.removeItem(key);
      }
      delete this.atoms[key];
    }
  }

  /**
   * Get all current atom keys.
   */
  getKeys(): string[] {
    return Object.keys(this.atoms);
  }
}

export default new AtomService();
