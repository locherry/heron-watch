import { SecureStorage, SecureStorageData } from '@/class/SecureStorage';
import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import RootView from '@/components/RootView';
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Discard() {

    const defaultUserSession = {
        username: 'username',
        email: 'email',
        language: 'en',
        role: 'default'
    } as SecureStorageData['user_session']

    const [userSession, setuserSession] = useState(defaultUserSession);

    useEffect(() => {
        // Fetch user session and update state
        SecureStorage.get("user_session")
            .then((session) => session && setuserSession(session))
    }, [])
    return (
        <RootView style={styles.container}>
            <Card style={styles.card}>
                <ThemedText>Profile</ThemedText>
                <Row>
                    <IconSymbol name='person.crop.circle' />
                    <ThemedText>{userSession.username}</ThemedText>
                </Row>
                <Row>
                    <IconSymbol name='envelope' />
                    <ThemedText>{userSession.email}</ThemedText>
                </Row>
                <Row>
                    <IconSymbol name='person.crop.circle' />
                    <ThemedText>{userSession.role} user</ThemedText>
                </Row>
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