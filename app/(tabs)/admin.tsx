import { Card } from '@/components/ui/Card';
import { RootView } from '@/components/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { StyleSheet } from 'react-native'

export default function Tab() {
  return <RootView style={styles.container}>
    <Card style={styles.card}>
      <ThemedText variant='h1'>Tab Admin</ThemedText>

    </Card>
  </RootView>
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
});