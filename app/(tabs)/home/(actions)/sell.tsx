import { Alert } from '@/components/Alert/Alert';
import { Card } from '@/components/layout/Card';
import { RootView } from '@/components/Themed/RootView';
import { ThemedText } from '@/components/Themed/ThemedText';
import { QRScannerButton } from '@/components/ui/Button/QRScannerButton';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

export default function Sell() {
  const { t } = useTranslation()
  return <RootView style={styles.container}>
    <Card style={styles.card}>
      <ThemedText variant='h1'>{t('sell')}</ThemedText>
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