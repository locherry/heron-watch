import { SecureStorage } from '@/classes/SecureStorage';
import { Alert } from '@/components/Alert/Alert';
import { SettingsEntry } from '@/components/SettingsEntry';
import { ThemedText } from '@/components/Themed/ThemedText';
import { Card } from '@/components/layout/Card';
import { Column } from '@/components/layout/Column';
import { RootView } from '@/components/layout/RootView';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Tab() {
  const {t} = useTranslation()
  const logout = () => {
    Alert.alert(t('Please confirm'), t('Do you really want to log out ?'), [
      {
        text: t('cancel'),
        onPress: () => console.info('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: t('OK'), onPress: () => {
          SecureStorage.remove("userSession")
          SecureStorage.remove("userPreferences")
          router.push('/login')
        }
      },
    ]);
  }

  return <RootView>
    <Card style={styles.card}>
      <ThemedText variant='h1'>{t("tabBar.settings")}</ThemedText>
      <Column gap={16} style={styles.settingsContainer}>
        <SettingsEntry
          iconName="person.crop.circle"
          href="/settings/profile"
          text={t("settings.profile.name")}
        />
        <SettingsEntry
          iconName="character.bubble"
          href='/settings/language'
          text={t("settings.language.name")}
        />
        <SettingsEntry
          iconName="paintpalette"
          href='/settings/appearance'
          text={t("settings.appearance.name")}
        />
        <SettingsEntry
          iconName="rectangle.portrait.and.arrow.right"
          onPress={logout}
          text={t("logout")}
        />
      </Column>
    </Card>
  </RootView>
}

const styles = StyleSheet.create({
  card: {
    gap: 16,
    flex: 1,
    padding: 16,
    alignItems: 'center',
    width: "100%"
  },
  settingsContainer: {
    minWidth: 200
  },

  triggerStyle: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 100,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  triggerText: {
    fontSize: 16,
  }
});