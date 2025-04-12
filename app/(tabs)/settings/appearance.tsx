import { SecureStorage, SecureStorageData } from '@/class/SecureStorage';
import { Card } from '@/components/ui/Card';
import { Header } from '@/components/Header';
import RootView from '@/components/RootView';
import { Row } from '@/components/ui/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Select } from '@/components/ui/Select';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { tintColors } from '@/constants/Colors';
import { Column } from '@/components/ui/Column';
import { ColorBall } from '@/components/ColorBall';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { IconSymbolName } from '@/constants/Icons';
import { Link } from 'expo-router';

export default function Appearance() {

    const THEMES = [
        { label: 'System default', value: 'system', iconName: 'gear' },
        { label: 'Light theme', value: 'light', iconName: 'sun.max.fill' },
        { label: 'Dark theme', value: 'dark', iconName: 'moon.fill' },
    ] satisfies {
        label: string,
        value: SecureStorageData['preferences']['theme'],
        iconName: IconSymbolName
    }[]

    const [themeSelected, setThemeSelected] = useState<typeof THEMES[number]['value'] | null>(null);
    const [colorSelected, setColorSelected] = useState<typeof tintColors[number]['name'] | null>(null);

    useEffect(()=>{
        SecureStorage.get('preferences').then(
            prefs => {
                setThemeSelected(prefs?.theme ?? 'system')
                setColorSelected(prefs?.colorScheme ?? tintColors[0]["name"])
            }
        )
    }, [themeSelected])

    const colors = useThemeColor()

    const applyThemeToApp = (themeValue: SecureStorageData['preferences']['theme']) => {
        setThemeSelected(themeValue)
        SecureStorage.modify('preferences', 'theme', themeValue)
    }
    const applyColorToApp = (colorValue: SecureStorageData['preferences']['colorScheme']) => {
        setColorSelected(colorValue)
        SecureStorage.modify('preferences', 'colorScheme', colorValue)
    }

    return (
        <RootView style={styles.container}>
            <Card style={styles.card}>
                <ThemedText variant='h2'>Appearance</ThemedText>
                <Column gap={16}>
                    <Card backgroundColor={colors.gray100} style={styles.appearanceItem}>
                        <ThemedText variant='h3'>Tint Color</ThemedText>
                        <Row gap={16}>
                            {tintColors.map((color) =>
                                <Pressable onPress={() => applyColorToApp(color.name)} key={color.name}>
                                    <Column center>
                                        <ColorBall
                                            colors={[color.dark, color.light]}
                                            active={colorSelected == color.name} />
                                        <ThemedText>{color.name}</ThemedText>
                                    </Column>
                                </Pressable>)}
                        </Row>
                    </Card>
                    <Card backgroundColor={colors.gray100} style={[styles.appearanceItem, { overflow: 'visible' }]}>
                        <ThemedText variant='h3'>Theme</ThemedText>
                        <Select options={THEMES} selectedValue={themeSelected}
                            onSelect={applyThemeToApp}/>
                    </Card>
                    <Card backgroundColor={colors.gray100} style={[styles.appearanceItem, {zIndex:-1}]}>
                        <ThemedText variant='h3'>UX</ThemedText>
                        <Link href='/settings/ux'  asChild>
                                <ThemedText variant='link'>View UX components</ThemedText>
                        </Link>
                    </Card>
                </Column>
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
    },
    appearanceItem: {
        alignItems: 'center',
        padding: 16,
        gap: 16
    }
});