import { router, Tabs } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { LucideIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
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

  const NavigationOptions = [
    {
      title: capitalizeFirst(t("tabBar.settings")),
      path: "settings",
      icon: Settings,
    },
    {
      title: capitalizeFirst(t("tabBar.home")),
      path: "home",
      icon: House,
    },
    {
      title: capitalizeFirst(t("tabBar.admin")),
      path: "admin",
      icon: Shield,
    },
  ] satisfies {
    title: string;
    path: string;
    icon: LucideIcon;
  }[];

  return isLargeScreen ? (
    <Drawer
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: {
          width: collapsed ? 64 : 240,
          paddingTop:10,
          marginTop: Platform.OS == "web" ? 0 : 20,
        },
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
              <Text className="ml-3">{capitalizeFirst(t("tabBar.menu"))}</Text>
            )}
          </TouchableOpacity>

          {/* Drawer Items */}
          {props.state.routes.map((route, index) => {
            const focused = index === props.state.index;
            const Icon = NavigationOptions.find(
              (option) => route.name == option.path
            )?.icon as LucideIcon;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => props.navigation.navigate(route.name)}
                className={`flex-row items-center rounded-md m-1 py-2 px-3 ${
                  collapsed ? "justify-center" : ""
                } ${focused ? "bg-muted" : ""}`} // ✅ Tailwind bg variable
              >
                <Icon
                  className={
                    focused ? "text-foreground" : "text-muted-foreground"
                  }
                />
                {!collapsed && (
                  <Text
                    className={`ml-3 text-base font-medium ${
                      focused ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {capitalizeFirst(
                      t(`tabBar.${route.name}` as "tabBar.settings")
                    )}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    >
      {NavigationOptions.map((option) => (
        <Drawer.Screen
          key={option.path}
          name={option.path}
          options={{
            drawerLabel: option.title,
            drawerIcon: ({ color }) => <option.icon color={color} />,
          }}
        />
      ))}
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
      {NavigationOptions.map((option) => (
        <Tabs.Screen
          key={option.path}
          name={option.path}
          options={{
            title: option.title,
            tabBarIcon: ({ color }) => <option.icon color={color} />,
          }}
        />
      ))}
    </Tabs>
  );
}
