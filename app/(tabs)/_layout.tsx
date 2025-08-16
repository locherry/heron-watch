import { router, Tabs, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { LucideIcon } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Platform,
  SafeAreaView,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { House } from "~/assets/images/icons/House";
import { Menu } from "~/assets/images/icons/Menu";
import { Settings } from "~/assets/images/icons/Settings";
import { Shield } from "~/assets/images/icons/Shield";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/lib/hooks/useAuth";
import { capitalizeFirst } from "~/lib/utils";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const NavigationOptions = [
    {
      title: capitalizeFirst(t("tabBar.settings")),
      path: "settings",
      icon: Settings,
    },
    { title: capitalizeFirst(t("tabBar.home")), path: "home", icon: House },
    { title: capitalizeFirst(t("tabBar.admin")), path: "admin", icon: Shield },
  ] satisfies { title: string; path: string; icon: LucideIcon }[];

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await useAuth();
      if (!authStatus) router.push("/login");
      setIsAuthenticated(authStatus);
    };
    checkAuth();
  }, []);

  const pathname = usePathname(); // get current path
  const pathSegment = pathname?.split("/").pop(); // get last segment
  const currentRoute = NavigationOptions.some((opt) => opt.path === pathSegment)
    ? pathSegment
    : "home"; // fallback if path invalid

  if (isAuthenticated === null) return null;

  return isLargeScreen ? (
    <Drawer
      initialRouteName={currentRoute}
      screenOptions={{
        drawerType: "permanent",
        drawerStyle: {
          paddingLeft: insets.left,
          marginTop: insets.top,
          width: collapsed
            ? Platform.OS === "web"
              ? 64
              : 100
            : Platform.OS === "web"
              ? 240
              : undefined,
          flexShrink: 0,
        },
        headerShown: false,
      }}
      drawerContent={(props) => (
        <SafeAreaView>
          <TouchableOpacity
            onPress={() => setCollapsed(!collapsed)}
            className={`flex-row items-center rounded-md m-1 py-2 px-3 hover:bg-muted ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <Menu className="text-foreground" />
            {!collapsed && (
              <Text className="ml-3">{capitalizeFirst(t("tabBar.menu"))}</Text>
            )}
          </TouchableOpacity>

          {props.state.routes.map((route, index) => {
            const focused = index === props.state.index;
            const Icon = NavigationOptions.find(
              (opt) => opt.path === route.name
            )?.icon as LucideIcon;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => props.navigation.navigate(route.name)}
                className={`flex-row items-center rounded-md m-1 py-2 px-3 hover:bg-muted ${
                  collapsed ? "justify-center" : ""
                } ${focused ? "bg-muted" : ""}`}
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
        </SafeAreaView>
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
      initialRouteName={currentRoute}
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
