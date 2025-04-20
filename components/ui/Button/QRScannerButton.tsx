import { BarcodeScanningResult, CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Platform, StyleSheet, View } from 'react-native';
import { ThemedText } from '../../Themed/ThemedText';
import { PulsingIcon } from '../Icon/PulsingIcon';
import { Button } from './Button';

type QRScannerButtonProps = {
  onQRDetect: (data: string) => void;
};

export const QRScannerButton: React.FC<QRScannerButtonProps> = ({ onQRDetect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [torchOn, setTorchOn] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const scanning = useRef(false);

  const handleOpenScanner = async () => {
    if (!permission?.granted) {
      await requestPermission();
    }
    setModalVisible(true);
    setTorchOn(false);
    scanning.current = false;
  };

  const handleClose = () => {
    setModalVisible(false);
    setTorchOn(false);
    scanning.current = false;
  };

  const handleBarCodeScanned = (result: BarcodeScanningResult) => {
    if (!scanning.current) {
      scanning.current = true;
      handleClose();
      onQRDetect(result.data);
    }
  };
  const { t } = useTranslation()

  return <View>
    <Button
      onPress={handleOpenScanner}
      iconName='viewfinder.rectangular'
      variant='primary'>
      <ThemedText variant='h2'>
        {t('Scan')}
      </ThemedText>
    </Button>
    <Modal visible={modalVisible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        {!permission?.granted ? (
          <View style={styles.permissionContainer}>
            <ThemedText>{t('Camera permission is required.')}</ThemedText>
            <Button onPress={requestPermission} iconName='viewfinder.rectangular'
            variant='primary'>
              <ThemedText variant='h2'>{t('Grant Permission')}</ThemedText>
            </Button>
          </View>
        ) : (
          <CameraView
            style={StyleSheet.absoluteFill}
            facing={"back"}
            enableTorch={torchOn}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
            onBarcodeScanned={handleBarCodeScanned}
          />
        )}
        <View style={styles.BottomButtons}>
          <Button
            onPress={() => setTorchOn((t) => !t)}
            iconName={torchOn ? 'flashlight.on.fill' : 'flashlight.off.fill'}
            iconColor="#fff"
            iconSize={45}
            style={styles.cameraBtn}
            disabled={Platform.OS == "web"}
          />
          <Button
            onPress={handleClose}
            iconName='xmark'
            iconColor="#fff"
            iconSize={45}
            style={styles.cameraBtn}
          />
        </View>

        {permission?.granted && <View style={styles.floatingShooter}>
          <PulsingIcon
            name="viewfinder"
            color="#fff"
            size={200}
            minScale={0.85}
            maxScale={1.15}
            duration={900}
          />
        </View> }
      </View>
    </Modal>
  </View>
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'flex-start',
  },
  floatingShooter: {
    position: 'absolute',
    inset: 0,
    bottom: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  BottomButtons: {
    position: 'absolute',
    bottom: 40,
    width: "100%",
    justifyContent: "center",
    flexDirection: 'row',
    zIndex: 2,
  },
  cameraBtn: {
    marginLeft: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 24,
    padding: 8
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
});
