import { DefaultSecureStorageData, SecureStorage, SecureStorageData } from '@/classes/SecureStorage';
import { RootView } from '@/components/Themed/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Card } from '@/components/layout/Card';
import { Select } from '@/components/ui/Select';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import i18n from '@/translations/i18n';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function Language() {
    const LANGUAGES = [
        { value: "EN", label: "English" },
        { value: "EU", label: "Euskera" },
        { value: "FR", label: "Français" },
    ] satisfies {
        value: SecureStorageData['userPreferences']['language'],
        label: string
    }[]

    const [selectedLanguage, setSelectedLanguage] = useState<typeof LANGUAGES[number]['value'] | null>(DefaultSecureStorageData['userPreferences']['language']);

    useEffect(() => {
        // Fetch user session and update state
        SecureStorage.get("userPreferences")
            .then((prefs) => prefs && setSelectedLanguage(prefs.language))
    }, [])

    const applyLanguageToApp = (languageValue: SecureStorageData['userPreferences']['language']) => {
        setSelectedLanguage(languageValue)
        SecureStorage.modify('userPreferences', 'language', languageValue)
        i18n.changeLanguage(languageValue)

        SecureStorage.get("userSession")
            .then((userSession) => {
                if (userSession) {
                    useFetchQuery(
                        '/users/[id]',
                        'PATCH',
                        {
                            user_preferences: {
                                language: languageValue
                            }
                        },
                        undefined,
                        { id: 1 }
                    ).catch(e=>console.log(e))
                }
            })
    }

    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant="h1">
                {t('settings.language.appLanguage')}</ThemedText>
            <View style={{ padding: 20 }}>
                <Select
                    options={LANGUAGES}
                    selectedValue={selectedLanguage}
                    onSelect={applyLanguageToApp}
                />
            </View>
        </Card>
    </RootView>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        gap: 16,
        flex: 1,
        padding: 16,
        alignItems: 'center',
        width: "100%"
    }
});