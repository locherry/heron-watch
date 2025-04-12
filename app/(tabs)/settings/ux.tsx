import { Card } from '@/components/ui/Card';
import { Column } from '@/components/ui/Column';
import { Header } from '@/components/Header';
import RootView from '@/components/RootView';
import { Alert } from '@/components/Themed/Alert';
import { ThemedText } from '@/components/Themed/ThemedText';
import { ThemedTextInput } from '@/components/Themed/ThemedTextInput';
import { View, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Select } from '@/components/ui/Select';
import { useState } from 'react';

export default function UX() {
  type T = keyof typeof Colors["light"]
  const alertTypes = ['danger', 'info', 'warning', 'success', 'light', 'dark'] as React.ComponentProps<typeof Alert>['type'][]
  const textVariants = ['h1', 'h2', 'h3', 'h4', 'subtitle', 'link'] as React.ComponentProps<typeof ThemedText>['variant'][]

  const [selected, setSelected] = useState('select an option')
  return (
    <RootView style={styles.container}>
      <Card style={styles.card}>
        <ScrollView>
          <Column gap={16}>
            <ThemedText variant='h1'>UX styles</ThemedText>
            <View style={styles.cardItem}>
              <ThemedText variant='h2'>Alert types :</ThemedText>
              <FlatList
                data={alertTypes}
                renderItem={e => <Alert type={e.item}>This is a {e.item} alert</Alert>} />
            </View>
            <View style={styles.cardItem}>
              <ThemedText variant='h2'>Text variants :</ThemedText>
              <FlatList
                data={textVariants}
                renderItem={e => <ThemedText variant={e.item}>This is a ThemedText component with the variant : {e.item}</ThemedText>} />
            </View>
            <ThemedTextInput onChange={() => { }} placeHolder='This is a ThemedTextInput' />
          </Column>
          <Select options={[{label:'1st option', value:"1"}, {label:'2nd option', value:"2"}, {label:'3rd option', value:"3"}]} selectedValue={selected} onSelect={setSelected}/>
        </ScrollView>
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