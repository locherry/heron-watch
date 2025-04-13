import { Card } from '@/components/ui/Card';
import { Column } from '@/components/ui/Column';
import { Header } from '@/components/Header';
import {RootView} from '@/components/RootView';
import { Alert } from '@/components/ui/AlertMessage';
import { ThemedText } from '@/components/Themed/ThemedText';
import { ThemedTextInput } from '@/components/Themed/ThemedTextInput';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

export default function Tab() {
  type T = keyof typeof Colors["light"]
  const alertTypes = ['danger', 'info', 'warning', 'success', 'light', 'dark'] as React.ComponentProps<typeof Alert>['type'][]
  const textVariants = ['h1', 'h2', 'h3', 'h4', 'subtitle', 'link'] as React.ComponentProps<typeof ThemedText>['variant'][]
  return (
    <RootView style={styles.container}>
      <Card style={styles.card}>
            <ThemedText variant='h1'>Tab Admin</ThemedText>
            
      </Card>
    </RootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    gap: 16,
    flex: 1,
    padding: 16,
    alignItems: 'center',
    width: "100%"
  },
  cardItem : {
    width:'100%'
  }
});