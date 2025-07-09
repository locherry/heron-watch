import { Card } from '@/components/layout/Card';
import { RootView } from '@/components/layout/RootView';
import { Row } from '@/components/layout/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Button } from '@/components/ui/Button/Button';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function usersPanel() {
    const colors = useThemeColor()
    type user = {
        id: number
        first_name: string
        last_name: string
        username: string
        email: string
        role: 'admin' | 'user'
    }

    // const users = useFetchQuery('/users')
    const [users, setUsers] = useState<user[] | null>(null)
    useEffect(() => {
        useFetchQuery('/users')
            .then(res => {
                if (Array.isArray(res)) {
                    setUsers(res as user[])
                }
            })
    }, [])
    const { t } = useTranslation()

    return (
        <RootView style={styles.container}>
            <Card style={styles.card}>
                <ThemedText variant='h1'>{t("admin.usersPanel.name")}</ThemedText>
                <Row gap={0} style={{ width: '100%', borderBottomWidth: 1, borderColor: colors.gray300, paddingBottom: 8, marginBottom: 8 }}>
                    <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{t('user.firstName')}</ThemedText>
                    <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{t('user.lastName')}</ThemedText>
                    <ThemedText style={{ flex: 2, fontWeight: 'bold' }}>{t('user.email')}</ThemedText>
                    <ThemedText style={{ flex: 1, fontWeight: 'bold' }}>{t('user.role')}</ThemedText>
                    <ThemedText style={{ width: 60 }}></ThemedText>
                </Row>
                {users && users.map(user => (
                    <Row gap={0} key={user.id} style={{ width: '100%', alignItems: 'center', borderBottomWidth: 1, borderColor: colors.gray100, paddingVertical: 8 }}>
                        <ThemedText style={{ flex: 1 }}>{user.first_name}</ThemedText>
                        <ThemedText style={{ flex: 1 }}>{user.last_name}</ThemedText>
                        <ThemedText style={{ flex: 2 }}>{user.email}</ThemedText>
                        <ThemedText style={{ flex: 1 }}>{user.role}</ThemedText>
                        <Button
                            type="info"
                            iconName="pencil"
                            onPress={() => router.push(`/admin/users/${user.id}`)}
                            // style={{ width: 60 }}
                        />
                    </Row>
                ))}
                <Button
                    type="primary"
                    iconName="plus"
                    text={t('user.addUser')}
                    onPress={() => router.push('/admin/users/new')}
                    style={{ marginTop: 24, alignSelf: 'center', minWidth: 160 }}
                />
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
    profileItem: {
        padding: 20,
        width: '100%'
    }
})