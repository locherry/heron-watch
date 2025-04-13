import { DefaultSecureStorageData, SecureStorage, SecureStorageData } from '@/classes/SecureStorage';
import { Card } from '@/components/ui/Card';
import { Column } from '@/components/ui/Column';
import { RootView } from '@/components/RootView';
import { Row } from '@/components/ui/Row';
import { SettingsEntry } from '@/components/SettingsEntry';
import { ThemedText } from '@/components/Themed/ThemedText';
import { DropdownMenu, MenuOption } from '@/components/ui/DropdownMenu';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Select } from '@/components/ui/Select';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Settings, StyleSheet, View } from 'react-native';
import { Alert } from '@/components/Alert/Alert';

export default function Tab() {
  const logout = () => {
    Alert.alert('Please confirm', 'Do you really want to log out ?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK', onPress: () => {
          SecureStorage.remove("user_session")
          router.push('/login')
        }
      },
    ]);
  }

  return <RootView>
    <Card style={styles.card}>
      <ThemedText variant='h1'>Settings</ThemedText>
      <Column gap={16} style={styles.settingsContainer}>
        <SettingsEntry
          iconName="person.crop.circle"
          href="/settings/profile"
          text="Profile"
        />
        <SettingsEntry
          iconName="character.bubble"
          text="Language options"
          href='/settings/language'
        />
        <SettingsEntry
          iconName="paintpalette"
          text="Appearance"
          href='/settings/appearance'
        />
        <SettingsEntry
          iconName="rectangle.portrait.and.arrow.right"
          onPress={logout}
          text="Logout"
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