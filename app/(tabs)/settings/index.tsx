import { t } from "i18next";
import React from "react";
import RootView from "~/components/layout/RootView";
import SettingsEntry from "~/components/SettingsEntry";
import { H2 } from "~/components/ui/typography";
import { Globe } from "~/lib/icons/Globe";
import { LogOut } from "~/lib/icons/LogOut";
import { Paintbrush } from "~/lib/icons/Paintbrush";
import { User } from "~/lib/icons/User";
import { capitalizeFirst } from "~/lib/utils";

export default function SettingsScreen() {
  // Handler for the logout confirmation
  const confirmLogout = () => {
    // Add your logout logic here (clear session, redirect, etc.)
    console.log("Logged out");
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
