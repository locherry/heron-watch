import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Card } from '@/components/layout/Card';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { RootView } from '@/components/layout/RootView';

export default function UserProfile() {
    const { id } = useLocalSearchParams();
    const { t } = useTranslation();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        if (id) {
            const userId = Array.isArray(id) ? id[0] : id;
            useFetchQuery('/users/[id]', 'GET', undefined, undefined, { id: Number(userId) })
                .then(res => {
                    console.log('User data:', res);
                    if (res && typeof res === 'object') setUser(res);
                    console.log(user)
                });
        }
    }, [id]);

    if (!user) return <ThemedText>{t('common.loading')}</ThemedText>;
    return (
        <RootView style={profileStyles.container}>
            <Card style={profileStyles.card}>
                <View style={profileStyles.profileIconContainer}>
                    <IconSymbol name="person.crop.circle" size={80} />
                </View>
                <ThemedText variant="h2" style={{ marginTop: 8, marginBottom: 4, textAlign: 'center' }}>{user.first_name} {user.last_name}</ThemedText>
                <View style={profileStyles.infoRow}>
                    <IconSymbol name="person.crop.circle" size={18} />
                    <ThemedText variant="subtitle" style={{ marginLeft: 8 }}>{user.username}</ThemedText>
                </View>
                <View style={profileStyles.infoRow}>
                    <IconSymbol name="envelope" size={18} />
                    <ThemedText style={{ marginLeft: 8 }}>{user.email}</ThemedText>
                </View>
                <View style={profileStyles.infoRow}>
                    <IconSymbol name="shield" size={18} />
                    <ThemedText style={{ marginLeft: 8 }}>{t('user.role')}: {user.role}</ThemedText>
                </View>
            </Card>
        </RootView>
    );
}

const profileStyles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        alignItems: 'center',
        paddingVertical: 32,
        gap: 16,
        width: '100%',
    },
    profileIconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 4,
    },
    infoIcon: {
        marginRight: 8,
    },
});