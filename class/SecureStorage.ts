import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
// import SecureStore from 'expo-secure-store';

export type SecureStorageData = {
    'user_session': {
        username: string,
        email: string,
        token: string,
        language: "en" | "ba" | "fr",
        role: 'admin' | 'default'
    }
}

export class SecureStorage {
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