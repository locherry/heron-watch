import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import {
  useTheme,
  type ParamListBase,
  type TabNavigationState,
} from "@react-navigation/native";
import { withLayoutContext } from "expo-router";
import { useTranslation } from "react-i18next";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function MaterialTopTabsLayout() {
  const { colors } = useTheme();
  const { t } = useTranslation();
  return (
    <MaterialTopTabs
      initialRouteName="raw_materials"
      screenOptions={{
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: "grey",
        tabBarLabelStyle: {
          fontSize: 14,
          // textTransform: "capitalize",
          fontWeight: "bold",
        },
        tabBarIndicatorStyle: {
          backgroundColor: colors.text,
        },
        tabBarScrollEnabled: true,
        tabBarItemStyle: { width: "auto", minWidth: 100 },
      }}
    >
      <MaterialTopTabs.Screen
        name="raw_materials"
        options={{
          title: t("Raw materials"),
        }}
      />
      <MaterialTopTabs.Screen
        name="finished_products"
        options={{
          title: t("Finished products"),
        }}
      />
    </MaterialTopTabs>
  );
}
