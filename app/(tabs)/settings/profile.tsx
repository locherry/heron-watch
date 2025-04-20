import { DefaultSecureStorageData, SecureStorage, SecureStorageData } from '@/classes/SecureStorage';
import { Card } from '@/components/layout/Card';
import { Row } from '@/components/layout/Row';
import { RootView } from '@/components/Themed/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Profile() {
    const colors = useThemeColor()

    const [userSession, setuserSession] = useState<SecureStorageData['userSession']>(DefaultSecureStorageData['userSession']);

    useEffect(() => {
        // Fetch user session and update state
        SecureStorage.get("userSession")
            .then((session) => session && setuserSession(session))
    }, [])
    const { t } = useTranslation()
    
    return <RootView style={styles.container}>
        <Card style={styles.card}>
            <ThemedText variant='h1'>{t("settings.profile.name")}</ThemedText>
            <Card backgroundColor={colors.gray100} style={styles.profileItem}>
                <ThemedText variant='h2' align='center'>{t('settings.profile.userInfo')}</ThemedText>
                <Row gap={8}>
                    <IconSymbol name='person.crop.circle' />
                    <ThemedText>{userSession.username}</ThemedText>
                </Row>
                <Row gap={8}>
                    <IconSymbol name='envelope' />
                    <ThemedText>{userSession.email}</ThemedText>
                </Row>
                <Row gap={8}>
                    <IconSymbol name='shield' />
                    <ThemedText>
                        {t(`settings.profile.userRole.${userSession.role}`, {
                            defaultValue: userSession.role // Shows raw role if no translation
                        })}</ThemedText>
                </Row>
            </Card>
            <Card backgroundColor={colors.gray100} style={styles.profileItem}>
                <Row gap={8}>
                    <IconSymbol name='trash' />
                    <ThemedText>Delete User</ThemedText>
                </Row>
            </Card>
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
    profileItem: {
        padding: 20,
    }
});