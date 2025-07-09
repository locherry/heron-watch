import { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { ThemedTextInput } from '@/components/Themed/ThemedTextInput';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Card } from '@/components/layout/Card';
import { Button } from '@/components/ui/Button/Button';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { IconSymbol } from '@/components/ui/Icon/IconSymbol';
import { RootView } from '@/components/layout/RootView';
import { Row } from '@/components/layout/Row';
import { Select } from '@/components/ui/Select';

type UserForm = {
    first_name: string;
    last_name: string;
    username: string;
    email: string;
    password: string;
    role: 'admin' | 'user';
};

export default function AddUser() {
    const { t } = useTranslation();
    const router = useRouter();
    const [form, setForm] = useState<UserForm>({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        role: 'user',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: string, value: string) => {
        setForm(f => ({ ...f, [key]: value }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            await useFetchQuery('/users', 'POST', form);
            router.back();
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <RootView style={styles.container}>
            <Card style={styles.card}>
                <ThemedText variant="h2">{t('user.addUser')}</ThemedText>
                <View style={{ gap: 8 }}>
                    <Row gap={8} style={styles.row}>
                        <IconSymbol name="pencil" size={18} />
                        <ThemedTextInput style={styles.textInput} placeHolder={t('user.firstName')} value={form.first_name} onChange={v => handleChange('first_name', v)} />
                    </Row>
                    <Row gap={8} style={styles.row}>
                        <IconSymbol name="pencil" size={18} />
                        <ThemedTextInput style={styles.textInput} placeHolder={t('user.lastName')} value={form.last_name} onChange={v => handleChange('last_name', v)} />
                    </Row>
                    <Row gap={8} style={styles.row}>
                        <IconSymbol name="person.crop.circle" size={18} />
                        <ThemedTextInput style={styles.textInput} placeHolder={t('user.username')} value={form.username} onChange={v => handleChange('username', v)} />
                    </Row>
                    <Row gap={8} style={styles.row}>
                        <IconSymbol name="envelope" size={18} />
                        <ThemedTextInput style={styles.textInput} placeHolder={t('user.email')} value={form.email} onChange={v => handleChange('email', v)} />
                    </Row>
                    <Row gap={8} style={styles.row}>
                        <IconSymbol name="lock" size={18} />
                        <ThemedTextInput style={styles.textInput} placeHolder={t('user.password')} secureTextEntry value={form.password} onChange={v => handleChange('password', v)} />
                    </Row>
                    <Row gap={8} style={styles.row}>
                        <IconSymbol name="shield" size={18} />
                        <Select
                            options={[
                                { label: t('user.admin'), value: 'admin'},
                                { label: t('user.user'), value: 'user'},
                            ]}
                            selectedValue={form.role}
                            onSelect={v => handleChange('role', v)}
                            placeholder={t('user.role')}
                        />
                    </Row>
                    <Button style={styles.confirmBtn} onPress={handleSubmit} text={t('common.add')} />
                    {error && <ThemedText style={{ color: 'red' }}>{error}</ThemedText>}
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
    },
    confirmBtn: {
        width: '100%',
    },
    row: {
        width: '100%',
        maxWidth: 400,
        alignSelf: 'center',
        flex: 1,
    },
    textInput: {
        flex: 1,
        minWidth: 0,
        width: '100%',
    }
})