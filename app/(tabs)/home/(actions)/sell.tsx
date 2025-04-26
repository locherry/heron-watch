import { Alert } from '@/components/Alert/Alert';
import { Card } from '@/components/layout/Card';
import { RootView } from '@/components/layout/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { ThemedTextInput } from '@/components/Themed/ThemedTextInput';
import { Button } from '@/components/ui/Button/Button';
import { QRScannerButton } from '@/components/ui/Button/QRScannerButton';
import { Select } from '@/components/ui/Select';
import { useThemeColor } from '@/hooks/color/useThemeColor';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

export default function Sell() {
  const { t } = useTranslation()
  const colors = useThemeColor()
  return <RootView style={styles.container}>
    <Card style={styles.card}>
      <ThemedText variant='h1'>{t('sell')}</ThemedText>

      <QRScannerButton onQRDetect={(qrData) => {
        // Handle the QR code data here
        Alert.alert('QR Detected: ', qrData);
      }} />

      <View style={styles.inputView}>
        <Select options={[{ key: 1, value: 2 }]} onSelect={() => { }} />
      </View>

      <View style={styles.inputView}>
        <ThemedText variant="h3" style={[styles.label]}>Email</ThemedText>
        <ThemedTextInput
          textContentType="name"
          onChange={() => { }}
          // value={email}

          placeHolder="Entrer action name ..." />
      </View>

      <View style={styles.inputView}>
        <ThemedText variant="h3" style={[styles.label]}>Product code</ThemedText>
        <ThemedTextInput
          textContentType="none"
          placeHolder="Entrer product code ..."
          onChange={() => { }}
        />
      </View>

      <ThemedTextInput
        onChange={() => { }}
        placeHolder='Quantity' />
      <ThemedTextInput
        onChange={() => { }}
        placeHolder='ProductCode' />
      <Button onPress={() => { }} text='Add action' />
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
  label: {
    alignSelf: "baseline",
    marginBlockEnd: 8
    // marginVertical: 20,
  },
  inputView: {
    // position: "relative",
    paddingVertical: 16,
  },
  loginBtn: {
    width: "100%",
    borderRadius: 8,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
});