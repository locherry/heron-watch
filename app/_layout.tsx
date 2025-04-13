import { RootView } from '@/components/RootView';
import { ThemeProvider } from '@/context/ThemeContext';
import { Slot } from 'expo-router';
import { Stack } from 'expo-router/stack';
 
export default function Layout() {
  return <ThemeProvider>
      <Slot />
  </ThemeProvider>
}