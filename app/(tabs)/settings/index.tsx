import { SecureStorage, SecureStorageData } from '@/class/SecureStorage';
import { Card } from '@/components/Card';
import RootView from '@/components/RootView';
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/Themed/ThemedText';
import { DropdownMenu, MenuOption } from '@/components/ui/DropdownMenu';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Select } from '@/components/ui/Select';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export default function Tab() {
  const languages = [
    { value: "en", label: "English" },
    { value: "ba", label: "Basque" },
    { value: "fr", label: "Français" },
  ];
  const [visible, setVisible] = useState(false);
  const user_session = SecureStorage.get("user_session")

  const defaultUserSession = {
    username: 'username',
    email: 'email',
    language: 'en'
  } as SecureStorageData['user_session']

  const [userSession, setuserSession] = useState(defaultUserSession);

  useEffect(() => {
    // Fetch user session and update state
    SecureStorage.get("user_session").then((session) => {
      if (session) {
        setuserSession(session);
        console.log(session)
      }
    })
  }, [])
  const logout = () => {
    SecureStorage.remove("user_session")
    router.push('/login')
  }

  return <RootView style={styles.container}>
    <Card style={styles.card}>
      <ThemedText variant='h1'>Settings</ThemedText>
      <Row>
        <IconSymbol name="person.crop.circle" />
        <Link href='/settings/profile' asChild>
          <ThemedText>Profile</ThemedText>
        </Link>
      </Row>
      <Pressable onPress={logout}>
        <Row>
          <IconSymbol name="rectangle.portrait.and.arrow.right" />
          <ThemedText>Logout</ThemedText>
        </Row>
      </Pressable>
      <Row>
        <IconSymbol name="character.bubble" />
        <View>
          <DropdownMenu
            visible={visible}
            handleOpen={() => setVisible(true)}
            handleClose={() => setVisible(false)}
            trigger={
              <View style={styles.triggerStyle}>
                <ThemedText style={styles.triggerText}>Select Language</ThemedText>
              </View>
            }
          >
            {languages.map((language) => <MenuOption
              onSelect={() => {
                setVisible(false);
              }}
              key={language.value}>
              <ThemedText>{language.label}</ThemedText>
            </MenuOption>)}
          </DropdownMenu>
        </View>
        {/* <Select options={languages}></Select> */}
      </Row>
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