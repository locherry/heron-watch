import { router, Tabs, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import {
  House,
  LucideIcon,
  PanelLeft,
  Settings,
  Shield,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  Image,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Row from "~/components/layout/Row";
import { Icon } from "~/components/ui/icon";
import { Text } from "~/components/ui/text";
import { constants } from "~/lib/constants";
import { useAuth } from "~/lib/hooks/useAuth";
import { capitalizeFirst } from "~/lib/utils";

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  // Drawer animation state
  const [collapsed, setCollapsed] = useState(false);
  const animatedWidth = React.useRef(new Animated.Value(240)).current; // start expanded
  const toggleDrawer = () => {
    const toValue = collapsed ? 240 : 60; // expanded : collapsed
    Animated.timing(animatedWidth, {
      toValue,
      duration: 250,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false, // layout animation → false required
    }).start();

    setCollapsed(!collapsed);
  };

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
          width: Platform.select({
            // native: 240,
            native:undefined,
            web: animatedWidth,
          }),
          flexShrink: 0,
        },
        headerShown: false,
      }}
      drawerContent={(props) => (
        <Animated.View
          style={{
            width: animatedWidth, // animate the inner container instead
            overflow: "hidden",
          }}
        >
          <TouchableOpacity
            onPress={toggleDrawer}
            className="flex-row items-center rounded-md m-1 py-2 px-3 hover:bg-muted"
          >
            {!collapsed ? (
              <Row className="flex-1 items-center">
                <Image
                  source={require("~/assets/images/icon.png")}
                  style={{ width: 24, height: 24 }}
                  className="w-6 h-6 shrink-0"
                />
                <Text className="ml-3 flex-1" numberOfLines={1}>
                  {constants.appName}
                </Text>
                <Icon size={24} as={PanelLeft} />
              </Row>
            ) : (
              <Icon size={24} as={PanelLeft} />
            )}
          </TouchableOpacity>

          {props.state.routes.map((route, index) => {
            const focused = index === props.state.index;
            const icon = NavigationOptions.find(
              (opt) => opt.path === route.name
            )?.icon as LucideIcon;

            return (
              <TouchableOpacity
                key={route.key}
                onPress={() => props.navigation.navigate(route.name)}
                className={`flex-row items-center rounded-md m-1 py-2 px-3 hover:bg-muted ${
                  focused ? "bg-muted" : ""
                }`}
              >
                <Icon
                  size={24}
                  as={icon}
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
        </Animated.View>
      )}
    >
      {NavigationOptions.map((option) => (
        <Drawer.Screen
          key={option.path}
          name={option.path}
          options={{
            drawerLabel: option.title,
            drawerIcon: ({ color }) => <Icon as={option.icon} color={color} />,
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
