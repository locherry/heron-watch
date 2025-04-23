import { Card } from '@/components/layout/Card';
import { RootView } from '@/components/Themed/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function statsPanel() {
    const colors = useThemeColor()
    
    const { t } = useTranslation()

    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1'>{t("admin.statsPanel.name")}</ThemedText>
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
        paddingHorizontal: '20%',
        alignItems: 'center',
        width: "100%"
    },
    profileItem: {
        padding: 20,
        width: '100%'
    }
})