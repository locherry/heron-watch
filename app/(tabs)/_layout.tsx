import { router, Tabs } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform } from "react-native";
import { House } from "~/lib/icons/House";
import { Settings } from "~/lib/icons/Settings";
import { Shield } from "~/lib/icons/Shield";
import { useAuth } from "~/lib/useAuth";
import { capitalizeFirst } from "~/lib/utils";

export default function TabLayout() {
  const { t } = useTranslation();

  // State to track if the user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Async function to check authentication status
    const checkAuth = async () => {
      // Call useAuth, which is assumed to be an async function returning boolean
      const authStatus = await useAuth();

      // If user is not authenticated, redirect to login page
      if (!authStatus) {
        router.replace('/login');
      }

      // Update the state with authentication status
      setIsAuthenticated(authStatus);
    };

    // Run the authentication check on component mount
    checkAuth();
  }, []);

  // While authentication status is unknown, render nothing
  if (isAuthenticated === null) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Hide header for all tabs
        tabBarStyle: Platform.select({
          ios: {
            // Use absolute position on iOS for transparent background / blur effect
            position: "absolute",
          },
          default: {},
        }),
      }}
    >
      {/* Settings Tab */}
      <Tabs.Screen
        name="settings"
        options={{
          title: capitalizeFirst(t("tabBar.settings")), // Translate and capitalize tab title
          tabBarIcon: ({ color }) => <Settings color={color} />, // Icon component with color
        }}
      />

      {/* Home Tab */}
      <Tabs.Screen
        name="home"
        options={{
          title: capitalizeFirst(t("tabBar.home")),
          tabBarIcon: ({ color }) => <House color={color} />,
        }}
      />

      {/* Admin Tab */}
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
