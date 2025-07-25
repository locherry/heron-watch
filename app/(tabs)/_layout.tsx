import { Tabs } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { House } from "~/lib/icons/House";
import { Settings } from "~/lib/icons/Settings";
import { Shield } from "~/lib/icons/Shield";
import { capitalizeFirst } from "~/lib/utils";

export default function TabLayout() {
  const { t } = useTranslation();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      <Tabs.Screen
        name="settings"
        options={{
          title: capitalizeFirst(t("tabBar.settings")),
          tabBarIcon: ({ color }) => <Settings color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: capitalizeFirst(t("tabBar.home")),
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: capitalizeFirst(t("tabBar.admin")),
          tabBarIcon: ({ color }) => <Shield color={color} />,
        }}
      />
    </Tabs>
  );
}
