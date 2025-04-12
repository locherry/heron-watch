import { DefaultSecureStorageData, SecureStorage, SecureStorageData } from '@/class/SecureStorage';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/Header';
import {RootView} from '@/components/RootView';
import { Row } from '@/components/ui/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Select } from '@/components/ui/Select';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Language() {

    const LANGUAGES = [
        { value: "en", label: "English" },
        { value: "eu", label: "Euskera" },
        { value: "fr", label: "Français" },
    ] satisfies {
        value:SecureStorageData['preferences']['language'],
        label:string
    }[]

    const [selectedLanguage, setSelectedLanguage] = useState<typeof LANGUAGES[number]['value'] | null>(DefaultSecureStorageData['preferences']['language']);

    useEffect(() => {
        // Fetch user session and update state
        SecureStorage.get("preferences")
            .then((prefs) => prefs && setSelectedLanguage(prefs.language))
    }, [])

    const applyLanguageToApp = (languageValue: SecureStorageData['preferences']['language']) => {
        setSelectedLanguage(languageValue)
        SecureStorage.modify('preferences', 'language', languageValue)
    }
    return (
        <RootView style={styles.container}>
            <Card style={styles.card}>
                <ThemedText variant='h1'>App language</ThemedText>
                <View style={{ padding: 20 }}>
                    <Select
                        options={LANGUAGES}
                        selectedValue={selectedLanguage}
                        onSelect={applyLanguageToApp}
                    />
                </View>
            </Card>
        </RootView>
    );
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