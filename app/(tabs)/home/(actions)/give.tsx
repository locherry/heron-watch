import { Card } from '@/components/ui/Card';
import { Header } from '@/components/Header';
import { RootView } from '@/components/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { DataTable, TableColumn } from '@/components/ui/DataTable';

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