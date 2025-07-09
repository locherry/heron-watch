import { ThemeProvider } from '@/contexts/ThemeContext';
import { Slot } from 'expo-router';
import React, { useEffect } from 'react';
import { LogBox } from 'react-native';

// import i18n (needs to be bundled ;))
import { SecureStorage } from '@/classes/SecureStorage';
import { useTranslation } from 'react-i18next';
import '../translations/i18n';

const hideNonRelevantLogs = (ignoredLogs: string[]) => {
  // Still use LogBox for in-app yellow box
  LogBox.ignoreLogs(ignoredLogs);

  // Monkey-patch console methods to filter out unwanted warnings
  if (__DEV__) {
    // @ts-expect-error
    const shouldIgnore = (args) =>
      ignoredLogs.some((log) => args.join(' ').includes(log));
    // @ts-expect-error
    const patchConsole = (method) => {
      // @ts-expect-error
      const original = console[method]
      // @ts-expect-error
      console[method] = (...args) => {
        if (!shouldIgnore(args)) {
          original(...args);
        }
      };
    };

    ['log', 'info', 'warn', 'error'].forEach(patchConsole);
  }
}

export default function Layout() {
  const { i18n } = useTranslation()

  // Suppress this warning, it comes from react navigation or similar library and wait for the update to remove this warning
  hideNonRelevantLogs([
    'props.pointerEvents is deprecated. Use style.pointerEvents',
    'findHostInstance_DEPRECATED' // TouchableOpacity deprecated ==> use Pressable instead
  ])


  useEffect(() => {
    SecureStorage.get("userPreferences").then(
      prefs => {
        prefs ? i18n.changeLanguage(prefs.language) : null
      }
    )
  }, [])
  return <React.StrictMode>
    {/* <Suspense fallback="...is loading"> */}
    <ThemeProvider>
      <Slot />
    </ThemeProvider>
    {/* </Suspense> */}
  </React.StrictMode>
}