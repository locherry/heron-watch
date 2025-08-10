// components/ui/QrScannerButton.tsx
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Platform, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { Flashlight } from "~/lib/icons/Flashlight";
import { FlashlightOff } from "~/lib/icons/FlashlightOff";
import { QrCode } from "~/lib/icons/QrCode";
import { Scan } from "~/lib/icons/Scan";
import { X } from "~/lib/icons/X";

interface QrScannerButtonProps extends React.ComponentProps<typeof Button> {
  onScan?: (data: string) => void;
}

export default function QrScannerButton({
  onScan,
  className,
  ...buttonProps
}: QrScannerButtonProps) {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannerOpen, setScannerOpen] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (scannerOpen && !permission?.granted) {
      requestPermission();
    }
  }, [scannerOpen]);

  useEffect(() => {
    if (scannerOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [scannerOpen]);

  if (!permission) {
    return null; // Still loading
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannerOpen(false);
    onScan?.(data);
  };

  return (
    <>
      <Button
        icon={QrCode}
        className={className}
        onPress={() => setScannerOpen(true)}
        {...buttonProps}
      />

      <Modal visible={scannerOpen} animationType="slide">
        {permission.granted ? (
          <View className="flex-1 bg-black">
            <CameraView
              className="flex-1"
              facing="back"
              enableTorch={torchOn}
              onBarcodeScanned={handleBarCodeScanned}
            >
              {/* Pulsing Scan Target */}
              <View className="flex-1 items-center justify-center">
                <Animated.View
                  style={{
                    width: "100%",
                    height: "40%",
                    transform: [{ scale: pulseAnim }],
                  }}
                >
                  <Scan className="flex-1 w-full text-white" strokeWidth={.5}/>
                </Animated.View>
              </View>

              {/* Bottom Controls */}
              <View className="absolute bottom-8 w-full flex-row justify-center space-x-8">
                <Button
                  icon={torchOn ? FlashlightOff : Flashlight}
                  variant="outline"
                  disabled={Platform.OS == "web" ? true : false}
                  className=""
                  onPress={() => setTorchOn((prev) => !prev)}
                />
                <Button
                  icon={X}
                  variant="outline"
                  className=""
                  onPress={() => setScannerOpen(false)}
                />
              </View>
            </CameraView>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="text-center text-white mb-4">
              Camera permission is required to scan QR codes.
            </Text>
            <Button onPress={requestPermission}>
              <Text>Grant Permission</Text>
            </Button>
            <Button
              icon={X}
              variant="outline"
              className="mt-4"
              onPress={() => setScannerOpen(false)}
            />
          </View>
        )}
      </Modal>
    </>
  );
}
