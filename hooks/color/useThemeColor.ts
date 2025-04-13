import { Colors, tintColors } from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';

export function useThemeColor() {
  const { theme, tint } = useTheme();

  return {
    ...Colors[theme],
    tint: tintColors.find(v => v.name === tint)?.[theme] ?? tintColors[0][theme],
    // complementary: theme === 'light' ? '#000000' : '#FFFFFF'
  };
}