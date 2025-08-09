import { languageRessources } from '@/translations/i18n'; // Import language options from translations
import * as SecureStore from 'expo-secure-store'; // Expo's secure storage for mobile (encrypted)
import { Platform } from 'react-native'; // Detects if running on iOS, Android, or Web

// Type definition for the structure of stored secure data
export type SecureStorageData = {
    userSession: { // Logged-in user session data
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        jwt: string, // JSON Web Token for authentication
        role: 'admin' | 'user'
    },
    userPreferences: { // User's app preferences
        theme: 'light' | 'dark' | 'system',
        language: keyof typeof languageRessources, // Language code from translations
    }
}

// Default values for secure storage (e.g., when nothing is saved yet)
export const DefaultSecureStorageData = {
    userSession: {
        id: 0,
        username: 'username',
        firstName: 'user',
        lastName: 'name',
        email: 'user.name@mail.com',
        jwt: '',
        role: 'user'
    },
    userPreferences: {
        theme: 'system',
        language: "EN",
    }
} satisfies SecureStorageData // Type-check against SecureStorageData

// Class for handling secure storage operations
export class SecureStorage {
    // Store a key-value pair securely
    static set = async <K extends keyof SecureStorageData>(
        key: K,
        value: SecureStorageData[K]
    ) => {
        try {
            const value_str = JSON.stringify(value); // Convert object to string

            if (Platform.OS === 'web') {
                // On web: store in sessionStorage
                await sessionStorage.setItem(key, value_str);
            } else {
                // On mobile: store using encrypted SecureStore
                await SecureStore.setItemAsync(key, value_str);
            }
            console.info('Data stored securely');
        } catch (error) {
            console.error('Error storing secure data', error);
        }
    }

    // Retrieve a stored value by key
    static get = async <K extends keyof SecureStorageData>(
        key: K
    ): Promise<SecureStorageData[K] | null> => {
        let value = null;
        try {
            if (Platform.OS === 'web') {
                if (sessionStorage) {
                    const res = await sessionStorage.getItem(key);
                    value = res != null ? JSON.parse(res) : res;
                }
            } else {
                value = await SecureStore.getItemAsync(key)
                    .then(res => res != null ? JSON.parse(res) : null);
            }
        } catch (error) {
            console.error('Error retrieving secure data', error);
        }
        return value;
    }

    // Modify one property of an object stored in secure storage
    static modify = async <
        K extends keyof SecureStorageData,     // Main key (e.g., "userSession")
        K2 extends keyof SecureStorageData[K] // Nested key (e.g., "email")
    >(
        key: K,
        key2: K2,
        value: SecureStorageData[K][K2]
    ) => {
        try {
            const oldData = await this.get(key); // Get existing data

            if (oldData) {
                // Spread the old data and replace only the specified property
                const updatedData = {
                    ...oldData,
                    [key2]: value
                };

                await this.set(key, updatedData);
            }

            console.info('Data modified securely');
        } catch (error) {
            console.error('Error storing secure data', error);
        }
    }

    // Remove a stored key
    static remove = async <K extends keyof SecureStorageData>(key: K) => {
        try {
            if (Platform.OS === 'web') {
                await sessionStorage.removeItem(key);
            } else {
                await SecureStore.deleteItemAsync(key);
            }
            console.info('Data removed successfully');
        } catch (error) {
            console.error('Error removing secure data', error);
        }
    }
}
