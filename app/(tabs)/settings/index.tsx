import { router } from "expo-router";
import { Globe, LogOut, Paintbrush, Scale, User } from "lucide-react-native";
import React from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "~/components/alert/Alert";
import RootView from "~/components/layout/RootView";
import SettingsEntry from "~/components/SettingsEntry";
import { Text } from "~/components/ui/text";
import { SecureStorage } from "~/lib/classes/SecureStorage";
import { capitalizeFirst } from "~/lib/utils";

export default function SettingsScreen() {
  const [t] = useTranslation()
  // Handler for the logout confirmation
  const confirLogout = () => {
    console.log("Logged out");
    SecureStorage.remove("userSession");
    SecureStorage.remove("userPreferences");
    router.push("/login"); // Redirect to login page
  };

  const confirmLogout = () => {
    Alert.alert(t("Please confirm"), t("Do you really want to log out ?"), [
      {
        text: t("common.cancel"),
        onPress: () => console.info("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: t("common.OK"),
        onPress: () => {
          SecureStorage.remove("userSession");
          SecureStorage.remove("userPreferences");
          router.push("/login");
        },
      },
    ]);
  };

  return (
    <RootView>
      <Text variant="h2">{capitalizeFirst(t("common.settings"))}</Text>
      <SettingsEntry
        href="/settings/appearance"
        icon={Paintbrush}
        title={capitalizeFirst(t("settings.appearance.name"))}
      />
      <SettingsEntry
        href="/settings/profile"
        icon={User}
        title={capitalizeFirst(t("settings.profile.name"))}
      />
      <SettingsEntry
        href="/settings/language"
        icon={Globe}
        title={capitalizeFirst(t("settings.language.name"))}
      />
      <SettingsEntry
        href="/settings/legal"
        icon={Scale}
        title={capitalizeFirst(t("settings.legal.name"))}
      />
      <SettingsEntry
        onPress={confirmLogout} // Trigger alert dialog on press
        icon={LogOut}
        title={capitalizeFirst(t("user.logout"))}
      />
    </RootView>
  );
}
