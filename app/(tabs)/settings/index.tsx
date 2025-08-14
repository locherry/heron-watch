import { router } from "expo-router";
import { t } from "i18next";
import React from "react";
import { Globe } from "~/assets/images/icons/Globe";
import { LogOut } from "~/assets/images/icons/LogOut";
import { Paintbrush } from "~/assets/images/icons/Paintbrush";
import { User } from "~/assets/images/icons/User";
import { Alert } from "~/components/alert/Alert";
import RootView from "~/components/layout/RootView";
import SettingsEntry from "~/components/SettingsEntry";
import { H2 } from "~/components/ui/typography";
import { SecureStorage } from "~/lib/classes/SecureStorage";
import { capitalizeFirst } from "~/lib/utils";

export default function SettingsScreen() {
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
      <H2>{capitalizeFirst(t("common.settings"))}</H2>
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
        onPress={confirmLogout} // Trigger alert dialog on press
        icon={LogOut}
        title={capitalizeFirst(t("user.logout"))}
      />
    </RootView>
  );
}
