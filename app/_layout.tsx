import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import * as React from "react";
import { Appearance, Platform } from "react-native";
import "~/global.css";
import { SecureStorage } from "~/lib/classes/SecureStorage";
import { NAV_THEME } from "~/lib/constants";
import { useColorScheme } from "~/lib/hooks/useColorScheme";

/* -------------------------------------------------------------------------- */
/*              Import translations and i18n configuration                   */
/*              i18n is bundled separately for localization support           */
/* -------------------------------------------------------------------------- */
import { useTranslation } from "react-i18next";
import "../translations/i18n";

/* -------------------------------------------------------------------------- */
/*                Ignore specific deprecation warnings from dependencies      */
/* -------------------------------------------------------------------------- */
import { LogBox } from "react-native";
import { ToastProvider } from "~/components/ui/toast";

LogBox.ignoreLogs([
  '"shadow*" style props are deprecated. Use "boxShadow".', // Ignore shadow* style deprecations
  "props.pointerEvents is deprecated. Use style.pointerEvents", // Ignore pointerEvents deprecations
  "Image: style.tintColor is deprecated. Please use props.tintColor.",
]);

/* -------------------------------------------------------------------------- */
/*                      Theme setup with Tailwind colors                      */
/* -------------------------------------------------------------------------- */

// Define light theme by extending React Navigation's DefaultTheme with custom colors
const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
};

// Define dark theme by extending React Navigation's DarkTheme with custom colors
const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
};

/* Export ErrorBoundary for catching runtime errors in the navigation layout */
export { ErrorBoundary } from "expo-router";

/* -------------------------------------------------------------------------- */
/*                            Setup React Query                               */
/* -------------------------------------------------------------------------- */

const queryClient = new QueryClient();

export default function RootLayout() {
  // Ref to track if component has already mounted to avoid redundant side effects
  const hasMounted = React.useRef(false);

  // Custom hook to get and set the color scheme from nativewind or other source
  const { colorScheme, isDarkColorScheme, setColorScheme } = useColorScheme();

  // State to track whether color scheme is loaded before rendering UI
  const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false);

  // Access i18n instance to handle language switching
  const { i18n } = useTranslation();

  // useIsomorphicLayoutEffect runs synchronously on native and asynchronously on web
  useIsomorphicLayoutEffect(() => {
    // Load user preferences (language, theme) from secure storage asynchronously
    SecureStorage.get("userPreferences").then((prefs) => {
      // If preferences exist, change language and set theme accordingly
      prefs && i18n.changeLanguage(prefs.language);
      const resolvedSystemTheme = Appearance.getColorScheme();
      const actualTheme = (prefs?.theme !== undefined && prefs.theme !== "system") ? prefs.theme : resolvedSystemTheme ?? "system"
      prefs && setColorScheme(actualTheme);
    });

    // Avoid running the rest of the effect on subsequent renders
    if (hasMounted.current) {
      return;
    }

    // On web, add a background color class to the html element to prevent white flicker on overscroll
    if (Platform.OS === "web") {
      document.documentElement.classList.add("bg-background");
      document.title = "Heron Watch";
    }

    // Mark color scheme as loaded and component as mounted
    setIsColorSchemeLoaded(true);
    hasMounted.current = true;

    // This pattern ensures that the screen orientation is unlocked when the component mounts,
    // allowing it to respond dynamically to the device’s orientation.
    if (Platform.OS !== "web") {
      const unlockScreenOrientation = async () => {
        try {
          await ScreenOrientation.unlockAsync();
        } catch (err) {
          console.warn("Could not unlock screen orientation:", err);
        }
      };
      unlockScreenOrientation();
    }
  }, []);

  // Prevent rendering UI until color scheme is loaded to avoid flicker
  if (!isColorSchemeLoaded) {
    return null;
  }
  return (
    <QueryClientProvider client={queryClient}>
      {/* Provide navigation theme based on current color scheme */}
      <ThemeProvider value={colorScheme == "dark" ? DARK_THEME : LIGHT_THEME}>
        {/* Render the navigation stack with header hidden */}
        <Stack screenOptions={{ headerShown: false }} />
        {/* PortalHost allows modals, tooltips, and other portals to render above */}
        <PortalHost />
        {/* Portal for react-native-toast-message */}
        <ToastProvider />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

/**
 * useIsomorphicLayoutEffect chooses between useLayoutEffect and useEffect
 * based on environment:
 * - On web, useEffect is used because useLayoutEffect can cause warnings with server-side rendering
 * - On native platforms, useLayoutEffect is preferred to avoid flickering and apply changes synchronously
 */
const useIsomorphicLayoutEffect =
  Platform.OS === "web" && typeof window === "undefined"
    ? React.useEffect
    : React.useLayoutEffect;
