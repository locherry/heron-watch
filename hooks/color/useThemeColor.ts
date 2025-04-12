import { Colors, tintColors } from '@/constants/Colors';
import { useColorScheme } from './useColorScheme';
import { useEffect, useState } from 'react';
import { SecureStorage } from '@/class/SecureStorage';

export function useThemeColor() {
  // const theme = useColorScheme() ?? 'light';
  const systemTheme = useColorScheme() ?? 'light';

  const [theme, setTheme] = useState<'light' | 'dark'>(systemTheme);

  const [tint, setTint] = useState<typeof tintColors[number]['name']>(tintColors[0]['name']);

  useEffect(() => {
    const loadTheme = async () => {
      const prefs = await SecureStorage
        .get('preferences')
        .catch(e => console.warn(e.message));
      setTheme(
        prefs?.theme === 'system' ? systemTheme :
          prefs?.theme || systemTheme
      )
      setTint(
        prefs?.colorScheme === 'system' ? systemTheme :
          prefs?.colorScheme || systemTheme
      )
    }
    loadTheme();
  }, [systemTheme]);


  const colors = {
    ...Colors[theme],
    tint: tintColors.find(v => v.name === tint)?.[theme] ?? tintColors[0][theme],
    complementary: theme === 'light' ? '#000000' : '#FFFFFF' // Replace with actual complementary logic
  };

  return colors;
}
