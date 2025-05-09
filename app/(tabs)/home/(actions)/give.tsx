import { Card } from '@/components/layout/Card';
import { RootView } from '@/components/layout/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import React from 'react';
import { StyleSheet } from 'react-native';

export default function Give() {

  return <RootView style={styles.container}>
    <Card style={styles.card}>
      <ThemedText variant='h1'>Give</ThemedText>
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
  }
});