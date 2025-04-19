import { Card } from '@/components/ui/Card';
import { Header } from '@/components/Header';
import { RootView } from '@/components/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/components/Alert/Alert';
import { QRScannerButton } from '@/components/ui/Button/QRScannerButton';

export default function Sell() {
  const { t } = useTranslation()
  return <RootView style={styles.container}>
    <Card style={styles.card}>
      <ThemedText variant='h2'>{t('sell')}</ThemedText>
      {/* <QRScanner /> */}

      <QRScannerButton onQRDetect={(qrData) => {
        // Handle the QR code data here
        Alert.alert('QR Detected: ', qrData);
      }} />
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