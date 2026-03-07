import { languageRessources } from "@/translations/i18n";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { UserRead } from "~/@types/user";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export type SecureStorageData = {
  userSession: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    jwt: string;
    roles: UserRead["roles"];
    preferences: {
      theme: "light" | "dark" | "system";
      language: keyof typeof languageRessources;
      fontSize: "small" | "medium" | "large";
    };
  };
};

// Utility type: deeply mark all properties as optional for partial updates
type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
};

/* -------------------------------------------------------------------------- */
/*                               Default Values                               */
/* -------------------------------------------------------------------------- */

export const DefaultSecureStorageData = {
  userSession: {
    id: 0,
    firstName: "user",
    lastName: "name",
    email: "user.name@mail.com",
    jwt: "",
    roles: ["ROLE_USER"] as UserRead["roles"],
    preferences: {
      theme: "system",
      language: "EN",
      fontSize: "medium",
    },
  },
} satisfies SecureStorageData;

/* -------------------------------------------------------------------------- */
/*                             Storage Adapters                               */
/* -------------------------------------------------------------------------- */

interface StorageAdapter {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

const webAdapter: StorageAdapter = {
  getItem: async (key) => sessionStorage.getItem(key),
  setItem: async (key, value) => sessionStorage.setItem(key, value),
  removeItem: async (key) => sessionStorage.removeItem(key),
};

const nativeAdapter: StorageAdapter = {
  getItem: async (key) => SecureStore.getItemAsync(key),
  setItem: async (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: async (key) => SecureStore.deleteItemAsync(key),
};

const adapter: StorageAdapter =
  Platform.OS === "web" ? webAdapter : nativeAdapter;

/* -------------------------------------------------------------------------- */
/*                               SecureStorage                                */
/* -------------------------------------------------------------------------- */

// In-memory cache to avoid redundant async reads in the same session
const cache = new Map<
  keyof SecureStorageData,
  SecureStorageData[keyof SecureStorageData]
>();

export class SecureStorage {
  /**
   * Store a value securely. Updates the in-memory cache immediately.
   */
  static set = async <K extends keyof SecureStorageData>(
    key: K,
    value: SecureStorageData[K],
  ): Promise<void> => {
    try {
      const serialized = JSON.stringify(value);
      await adapter.setItem(key, serialized);
      cache.set(key, value);
      console.info(`[SecureStorage] set "${key}"`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to set "${key}"`, error);
      throw error;
    }
  };

  /**
   * Retrieve a stored value. Returns from cache if available,
   * otherwise reads from storage and seeds the cache.
   * Returns null if the key has never been set.
   */
  static get = async <K extends keyof SecureStorageData>(
    key: K,
  ): Promise<SecureStorageData[K] | null> => {
    try {
      // Return from cache if available
      if (cache.has(key)) {
        return cache.get(key) as SecureStorageData[K];
      }

      const raw = await adapter.getItem(key);
      if (raw === null) return null;

      const parsed = JSON.parse(raw) as SecureStorageData[K];
      cache.set(key, parsed);
      return parsed;
    } catch (error) {
      console.error(`[SecureStorage] Failed to get "${key}"`, error);
      return null;
    }
  };

  /**
   * Retrieve a stored value, falling back to the default if not set.
   * Guaranteed to never return null.
   */
  static getOrDefault = async <K extends keyof SecureStorageData>(
    key: K,
  ): Promise<SecureStorageData[K]> => {
    const value = await SecureStorage.get(key);
    return value ?? (DefaultSecureStorageData[key] as SecureStorageData[K]);
  };

  /**
   * Deeply merge a partial update into an existing stored object.
   * Safe to call on nested objects like `preferences`.
   *
   * @example
   * await SecureStorage.merge("userSession", { preferences: { theme: "dark" } });
   */
  static merge = async <K extends keyof SecureStorageData>(
    key: K,
    partial: DeepPartial<SecureStorageData[K]>,
  ): Promise<void> => {
    try {
      const existing = await SecureStorage.getOrDefault(key);
      const merged = deepMerge(existing, partial) as SecureStorageData[K];
      await SecureStorage.set(key, merged);
      console.info(`[SecureStorage] merged "${key}"`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to merge "${key}"`, error);
      throw error;
    }
  };

  /**
   * Shallow-update a single top-level key within a stored object.
   * For nested updates (e.g. preferences), use `merge` instead.
   *
   * @example
   * await SecureStorage.modify("userSession", "email", "new@mail.com");
   */
  static modify = async <
    K extends keyof SecureStorageData,
    K2 extends keyof SecureStorageData[K],
  >(
    key: K,
    key2: K2,
    value: SecureStorageData[K][K2],
  ): Promise<void> => {
    try {
      const existing = await SecureStorage.getOrDefault(key);
      const updated: SecureStorageData[K] = { ...existing, [key2]: value };
      await SecureStorage.set(key, updated);
      console.info(`[SecureStorage] modified "${key}.${String(key2)}"`);
    } catch (error) {
      console.error(
        `[SecureStorage] Failed to modify "${key}.${String(key2)}"`,
        error,
      );
      throw error;
    }
  };

  /**
   * Remove a key from storage and invalidate the cache entry.
   */
  static remove = async <K extends keyof SecureStorageData>(
    key: K,
  ): Promise<void> => {
    try {
      await adapter.removeItem(key);
      cache.delete(key);
      console.info(`[SecureStorage] removed "${key}"`);
    } catch (error) {
      console.error(`[SecureStorage] Failed to remove "${key}"`, error);
      throw error;
    }
  };

  /**
   * Clear all keys from storage and wipe the in-memory cache.
   * Useful on logout.
   */
  static clear = async (): Promise<void> => {
    try {
      const keys = Object.keys(DefaultSecureStorageData) as Array<
        keyof SecureStorageData
      >;
      await Promise.all(keys.map((key) => adapter.removeItem(key)));
      cache.clear();
      console.info("[SecureStorage] cleared all keys");
    } catch (error) {
      console.error("[SecureStorage] Failed to clear storage", error);
      throw error;
    }
  };

  /**
   * Invalidate the in-memory cache for a specific key,
   * forcing the next `get` to re-read from storage.
   */
  static invalidate = <K extends keyof SecureStorageData>(key: K): void => {
    cache.delete(key);
  };

  /**
   * Seed the cache from storage for all known keys.
   * Call this once on app startup to warm the cache.
   */
  static preload = async (): Promise<void> => {
    const keys = Object.keys(DefaultSecureStorageData) as Array<
      keyof SecureStorageData
    >;
    await Promise.all(keys.map((key) => SecureStorage.get(key)));
    console.info("[SecureStorage] preloaded all keys into cache");
  };
}

/* -------------------------------------------------------------------------- */
/*                               Utilities                                    */
/* -------------------------------------------------------------------------- */

/**
 * Recursively merges `partial` into `base`.
 * Plain objects are merged deeply; all other values are overwritten.
 */
function deepMerge<T extends object>(base: T, partial: DeepPartial<T>): T {
  const result = { ...base };
  for (const key in partial) {
    const partialVal = partial[key];
    const baseVal = base[key];
    if (
      partialVal !== undefined &&
      isPlainObject(partialVal) &&
      isPlainObject(baseVal)
    ) {
      result[key] = deepMerge(
        baseVal as object,
        partialVal as DeepPartial<object>,
      ) as T[typeof key];
    } else if (partialVal !== undefined) {
      result[key] = partialVal as T[typeof key];
    }
  }
  return result;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
