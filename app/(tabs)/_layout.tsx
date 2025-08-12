import { router, Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { Text } from "~/components/ui/text";
import { House } from "~/lib/icons/House";
import { Menu } from "~/lib/icons/Menu";
import { Settings } from "~/lib/icons/Settings";
import { Shield } from "~/lib/icons/Shield";
import { useAuth } from "~/lib/useAuth";
import { capitalizeFirst } from "~/lib/utils";

export default function TabLayout() {
  const { t } = useTranslation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768; // breakpoint
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await useAuth();
      if (!authStatus) router.replace("/login");
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) return null;

  return isLargeScreen ? (
    <Drawer
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: { width: collapsed ? 72 : 240 },
        headerShown: false,
      }}
      drawerContent={(props) => (
        <View className="flex-1">
          {/* Toggle Button */}
          <TouchableOpacity
            onPress={() => setCollapsed(!collapsed)}
            className={`flex-row items-center rounded-md m-1 py-2 px-3 ${collapsed ? "justify-center" : ""}`}
          >
            <Menu className="text-foreground" />
            {!collapsed && (
              <Text className="ml-3 text-base font-medium">
                {capitalizeFirst(t("tabBar.menu"))}
              </Text>
            )}
          </TouchableOpacity>

          {/* Drawer Items */}
          {props.state.routes.map((route, index) => {
            const focused = index === props.state.index;
            const Icon =
              route.name === "home"
                ? House
                : route.name === "settings"
                ? Settings
                : Shield;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => props.navigation.navigate(route.name)}
                className={`flex-row items-center rounded-md m-1 py-2 px-3 ${collapsed ? "justify-center" : ""} ${
                  focused ? "bg-[#e4e6eb]" : ""
                }`}
              >
                <Icon color={focused ? "#000" : "#555"} />
                {!collapsed && (
                  <Text
                    className={`ml-3 text-base font-medium ${
                      focused ? "text-black" : "text-[#555]"
                    }`}
                  >
                    {capitalizeFirst(t(`tabBar.${route.name}` as "tabBar.settings"))}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      <Drawer.Screen
        name="settings"
        options={{
          drawerLabel: capitalizeFirst(t("tabBar.settings")),
          drawerIcon: ({ color }) => <Settings color={color} />,
        }}
      />
      <Drawer.Screen
        name="home"
        options={{
          drawerLabel: capitalizeFirst(t("tabBar.home")),
          drawerIcon: ({ color }) => <House color={color} />,
        }}
      />
      <Drawer.Screen
        name="admin"
        options={{
          drawerLabel: capitalizeFirst(t("tabBar.admin")),
          drawerIcon: ({ color }) => <Shield color={color} />,
        }}
      />
    </Drawer>
  ) : (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
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
