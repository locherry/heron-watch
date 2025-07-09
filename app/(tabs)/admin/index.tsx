import { SettingsEntry } from '@/components/SettingsEntry';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Card } from '@/components/layout/Card';
import { Column } from '@/components/layout/Column';
import { RootView } from '@/components/layout/RootView';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Tab() {
    const { t } = useTranslation()
    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1'>{t('admin.tabName')}</ThemedText>
            <Column gap={16}>
                <SettingsEntry
                    iconName="person.2"
                    href="/admin/users"
                    text={t("admin.usersPanel.name")}
                />
                <SettingsEntry
                    iconName="rectangle.stack"
                    href="/admin/stocksPanel"
                    text={t("admin.stocksPanel.name")}
                />
                <SettingsEntry
                    iconName="chart.pie"
                    href="/admin/statsPanel"
                    text={t("admin.statsPanel.name")}
                />
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
})