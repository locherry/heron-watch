import { languageRessources } from '@/translations/i18n';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type SecureStorageData = {
    userSession: {
        id: number,
        username: string,
        firstName: string,
        lastName: string,
        email: string,
        jwt: string,
        role: 'admin' | 'user'
    },
    userPreferences: {
        theme: 'light' | 'dark' | 'system',
        language: keyof typeof languageRessources,
    }
}

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
} satisfies SecureStorageData

export class SecureStorage {
    // static initializeDefaults = async () => {
    //     const entries = Object.entries(DefaultSecureStorageData) as [
    //         keyof typeof DefaultSecureStorageData,
    //         typeof DefaultSecureStorageData[keyof typeof DefaultSecureStorageData]
    //     ][];

    //     await Promise.all(
    //         entries.map(([key, value]) => {
    //             this.get(key).then(data => !data ? this.set(key, value) : null)
    //         })
    //     );
    // }

    static set = async <K extends keyof SecureStorageData>(
        key: K,
        value: SecureStorageData[K]
    ) => {
        try {
            const value_str = JSON.stringify(value)

            if (Platform.OS === 'web') {
                await sessionStorage.setItem(key, value_str)
            } else {
                await SecureStore.setItemAsync(key, value_str)
            }
            console.info('Data stored securely');
        } catch (error) {
            console.error('Error storing secure data', error);
        }
    }

    static get = async <K extends keyof SecureStorageData>(key: K): Promise<SecureStorageData[K] | null> => {
        let value = null
        try {
            if (Platform.OS === 'web') {
                if (sessionStorage) {
                    const res = await sessionStorage.getItem(key)
                    value = res != null ? JSON.parse(res) : res
                }
            } else {
                value = await SecureStore.getItemAsync(key).then(res => res != null ? JSON.parse(res) : null)
            }
        } catch (error) {
            console.error('Error retrieving secure data', error);
        }
        return value
    }

    static modify = async <
        K extends keyof SecureStorageData,
        K2 extends keyof SecureStorageData[K]
    >(
        key: K,
        key2: K2,
        value: SecureStorageData[K][K2]
    ) => {
        try {
            const oldData = await this.get(key);

            if (oldData) {
                // Use computed property name syntax
                const updatedData = {
                    ...oldData,
                    [key2]: value // Dynamic key assignment
                };

                await this.set(key, updatedData);
            }

            console.info('Data modified securely');
        } catch (error) {
            console.error('Error storing secure data', error);
        }
    }

    static remove = async <K extends keyof SecureStorageData>(key: K) => {
        try {
            if (Platform.OS === 'web') {
                await sessionStorage.removeItem(key)
            } else {
                await SecureStore.deleteItemAsync(key)
            }
            console.info('Data removed successfully');

        } catch (error) {
            console.error('Error removing secure data', error);
        }
    }
}