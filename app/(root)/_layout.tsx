import { Stack } from 'expo-router/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return <Stack
      screenOptions={
        {
          headerShown: false
        }
      } />
}