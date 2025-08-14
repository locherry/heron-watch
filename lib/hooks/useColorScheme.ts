import { useColorScheme as useNativewindColorScheme } from 'nativewind'; 
// Import NativeWind's color scheme hook (detects and controls theme)

/**
 * Custom wrapper around NativeWind's color scheme hook
 * - Ensures a default theme when none is set
 * - Adds convenience booleans for readability
 */
export function useColorScheme() {
  // Destructure theme state and actions from NativeWind
  const { colorScheme, setColorScheme, toggleColorScheme } = useNativewindColorScheme();

  return {
    // Use the detected color scheme, defaulting to 'dark' if null/undefined
    colorScheme: colorScheme ?? 'dark',

    // Boolean shortcut: true if theme is explicitly dark
    isDarkColorScheme: colorScheme === 'dark',

    // Setter function to manually change theme ('light', 'dark', or 'system')
    setColorScheme,

    // Toggles between light/dark mode
    toggleColorScheme,
  };
}
