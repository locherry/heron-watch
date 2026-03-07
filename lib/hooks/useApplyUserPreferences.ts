import { rem, useColorScheme } from "nativewind";
import { Appearance, Platform } from "react-native";
import { SecureStorage } from "~/lib/classes/SecureStorage";
import i18n from "~/translations/i18n";

/**
 * Returns an `applyPreferences` function that reads the saved userSession
 * and applies theme, language, and font size to the UI.
 *
 * Call it:
 *  - after login (pass preferences directly to avoid a redundant storage read)
 *  - on app startup in _layout.tsx (no argument, reads from storage)
 */
export function useApplyUserPreferences() {
  const { setColorScheme } = useColorScheme();

  const applyPreferences = async (
    overrides?: Partial<{
      theme: "light" | "dark" | "system";
      language: string;
      fontSize: "small" | "medium" | "large";
    }>,
  ) => {
    const userSession = await SecureStorage.get("userSession");
    const prefs = {
      ...userSession?.preferences,
      ...overrides, // allow passing fresh values directly (e.g. right after login)
    };

    // Theme
    if (prefs.theme) {
      if (Platform.OS === "web" && prefs.theme === "system") {
        setColorScheme(Appearance.getColorScheme() ?? "light");
      } else {
        setColorScheme(prefs.theme);
      }
    }

    // Language
    if (prefs.language) {
      i18n.changeLanguage(prefs.language);
    }

    // Font size
    const fontSizeOptions = [
      { value: "small", size: 14, rem: 14 },
      { value: "medium", size: 16, rem: 16 },
      { value: "large", size: 18, rem: 18 },
    ] as const;
    if (prefs.fontSize) {
      const option = fontSizeOptions.find((o) => o.value === prefs.fontSize);
      if (option) {
        rem.set(option.rem);
      }
    }
  };

  return { applyPreferences };
}
