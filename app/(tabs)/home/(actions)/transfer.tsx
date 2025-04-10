import { Card } from '@/components/Card';
import { Header } from '@/components/Header';
import RootView from '@/components/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { View, Text, StyleSheet } from 'react-native';

export default function Transfer() {
  return (
    <RootView style={styles.container}>
      <Card style={styles.card}>
        <ThemedText>Transfer</ThemedText>
      </Card>
    </RootView>
  );
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
    width:"100%"
  }
});