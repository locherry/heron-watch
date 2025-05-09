import { SecureStorage, SecureStorageData } from '@/classes/SecureStorage';
import { Card } from '@/components/layout/Card';
import { Column } from '@/components/layout/Column';
import { RootView } from '@/components/layout/RootView';
import { Row } from '@/components/layout/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { ColorBall } from '@/components/ui/ColorBall';
import { Select } from '@/components/ui/Select';
import { tintColors } from '@/constants/Colors';
import { IconSymbolName } from '@/constants/Icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet } from 'react-native';

export default function Appearance() {

    const { t } = useTranslation()
    const { setTheme, setTint } = useTheme()

    const THEMES = [
        { label: t('settings.appearance.systemDefault'), value: 'system', iconName: 'gearshape' },
        { label: t('settings.appearance.lightTheme'), value: 'light', iconName: 'sun.max.fill' },
        { label: t('settings.appearance.darkTheme'), value: 'dark', iconName: 'moon.fill' },
    ] satisfies {
        label: string,
        value: SecureStorageData['userPreferences']['theme'],
        iconName: IconSymbolName
    }[]

    const [themeSelected, setThemeSelected] = useState<typeof THEMES[number]['value'] | null>(null);
    const [colorSelected, setColorSelected] = useState<typeof tintColors[number]['name'] | null>(null);

    useEffect(() => {
        SecureStorage.get('userPreferences').then(
            prefs => {
                setThemeSelected(prefs?.theme ?? 'system')
                setColorSelected(prefs?.tintColor ?? tintColors[0]["name"])
            }
        )
    }, [])

    const colors = useThemeColor()

    const applyThemeToApp = (themeValue: SecureStorageData['userPreferences']['theme']) => {
        setThemeSelected(themeValue)
        setTheme(themeValue)

        SecureStorage.get("userSession")
            .then((userSession) => {
                if (userSession) {
                    useFetchQuery(
                        '/users/[id]',
                        'PATCH',
                        {
                            user_preferences: {
                                theme: themeValue
                            }
                        },
                        undefined,
                        { id: userSession.id }
                    ).catch(e => console.error(e))
                }
            })
    }

    const applyColorToApp = (tintValue: SecureStorageData['userPreferences']['tintColor']) => {
        setColorSelected(tintValue)
        setTint(tintValue)

        SecureStorage.get("userSession")
            .then((userSession) => {
                if (userSession) {
                    useFetchQuery(
                        '/users/[id]',
                        'PATCH',
                        {
                            user_preferences: {
                                tint_color: tintValue
                            }
                        },
                        undefined,
                        { id: userSession.id }
                    ).catch(e => console.error(e))
                }
            })
    }

    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1'>{t('settings.appearance.name')}</ThemedText>
            <Column gap={16}>
                <Card backgroundColor={colors.gray100} style={styles.appearanceItem}>
                    <ThemedText variant='h2'>{t('settings.appearance.tintColor')}</ThemedText>
                    <Row gap={16}>
                        {tintColors.map((color) =>
                            <Pressable onPress={() => applyColorToApp(color.name)} key={color.name}>
                                <Column center>
                                    <ColorBall
                                        colors={[color.dark, color.light]}
                                        active={colorSelected == color.name} />
                                    <ThemedText>{t(`color.${color.name}`)}</ThemedText>
                                </Column>
                            </Pressable>)}
                    </Row>
                </Card>
                <Card backgroundColor={colors.gray100} style={[styles.appearanceItem, { overflow: 'visible' }]}>
                    <ThemedText variant='h2'>{t('settings.appearance.theme')}</ThemedText>
                    <Select options={THEMES} selectedValue={themeSelected}
                        onSelect={applyThemeToApp} />
                </Card>
                <Card backgroundColor={colors.gray100} style={[styles.appearanceItem, { zIndex: -1 }]}>
                    <ThemedText variant='h2'>UX</ThemedText>
                    <Link href='/settings/ux'>
                        <ThemedText variant='link'>View UX components</ThemedText>
                    </Link>
                </Card>
            </Column>
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
    },
    appearanceItem: {
        alignItems: 'center',
        padding: 16,
        gap: 16
    }
});