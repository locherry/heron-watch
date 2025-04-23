import { Card } from '@/components/layout/Card';
import { Row } from '@/components/layout/Row';
import { RootView } from '@/components/Themed/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Button } from '@/components/ui/Button/Button';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useFetchQuery } from '@/hooks/useFetchQuery';
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
        role: 'admin' | 'default'
    }
    const refresh = () => {
        useFetchQuery('/users')
            .then(res => res && setUsers(res))
    }

    // const users = useFetchQuery('/users')
    const [users, setUsers] = useState<user[] | null>(null)
    useEffect(() => {
        useFetchQuery('/users')
            .then(res => res && setUsers(res))
    }, [])
    const { t } = useTranslation()

    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1'>{t("admin.usersPanel.name")}</ThemedText>
            <Button text='refresh' onPress={refresh}></Button>
            {users && users.map(user => <Row gap={8} key={user.id}>
                <ThemedText>{user.first_name}</ThemedText>
                <ThemedText>{user.last_name}</ThemedText>
                <ThemedText>{user.email}</ThemedText>
            </Row>
            )}
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