import { tintColors } from '@/constants/Colors';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type SecureStorageData = {
    user_session: {
        id : number,
        username: string,
        email: string,
        jwt: string,
        role: 'admin' | 'default'
    },
    preferences: {
        theme: 'light' | 'dark' | 'system',
        colorScheme: typeof tintColors[number]['name']
        language: "en" | "eu" | "fr",
    }
}

export const DefaultSecureStorageData = {
    user_session: {
        id: 0,
        username: 'username',
        email: 'user.name@mail.com',
        jwt: '',
        role: 'default'
    },
    preferences: {
        theme: 'system',
        colorScheme: tintColors[0]['name'],
        language: "en",
    }
} satisfies SecureStorageData

export class SecureStorage {
    static initializeDefaults = async () => {
        const entries = Object.entries(DefaultSecureStorageData) as [
            keyof typeof DefaultSecureStorageData,
            typeof DefaultSecureStorageData[keyof typeof DefaultSecureStorageData]
        ][];

        await Promise.all(
            entries.map(([key, value]) => {
                this.get(key).then(data => !data? this.set(key, value) : null)
            })
        );
    }

    static set = async <K extends keyof SecureStorageData>(
        key: K,
        value: SecureStorageData[K]
    ) => {
        try {
            const value_str = JSON.stringify(value)

            if (Platform.OS === 'web') {
                await sessionStorage.setItem(key, value_str);
            } else {
                await SecureStore.setItemAsync(key, value_str);
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
                const res = await sessionStorage.getItem(key)
                value = res != null ? JSON.parse(res) : res
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