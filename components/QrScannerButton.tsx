import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Easing, Modal, Platform, View } from "react-native";
import { Flashlight } from "~/assets/images/icons/Flashlight";
import { FlashlightOff } from "~/assets/images/icons/FlashlightOff";
import { QrCode } from "~/assets/images/icons/QrCode";
import { Scan } from "~/assets/images/icons/Scan";
import { X } from "~/assets/images/icons/X";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import Row from "./layout/Row";

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

  // Handle pulse animation only when scanner is open
  useEffect(() => {
    if (scannerOpen) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== "web",
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: Platform.OS !== "web",
          }),
        ])
      ).start();
    }
  }, [scannerOpen]);

  if (!permission) {
    return null; // Still loading permission object
  }

  const openScanner = async () => {
    if (!permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        return; // Don't open if still not granted
      }
    }
    setScannerOpen(true);
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannerOpen(false);
    onScan?.(data);
  };

  return (
    <>
      <Button
        icon={QrCode}
        className={className}
        onPress={openScanner}
        {...buttonProps}
      />

      <Modal visible={scannerOpen} animationType="slide">
        {permission.granted ? (
          <View className="flex-1 bg-black">
            {/* Camera feed */}
            <CameraView
              style={{ flex: 1 }} // No className, it doesn't work here
              facing="back"
              enableTorch={torchOn}
              barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              onBarcodeScanned={handleBarCodeScanned}
            />

            {/* Pulsing Scan Target */}
            <View className="absolute inset-0 items-center justify-center">
              <Animated.View
                style={[
                  {
                    width: "80%", // take most of the screen width
                    aspectRatio: 1, // keep square
                    transform: [{ scale: pulseAnim }],
                    alignItems: "center",
                    justifyContent: "center",
                  },
                  Platform.OS === "web" ? { height: "80%" } : {}, // Adjust height not to overflow on web
                ]}
              >
                <Scan
                  width="100%"
                  height="100%"
                  preserveAspectRatio="xMidYMid meet"
                  className="flex-1 w-full h-full text-white"
                  strokeWidth={0.5}
                />
              </Animated.View>
            </View>

            {/* Bottom Controls */}
            <Row
              gap={16}
              className="absolute bottom-8 w-full flex-row justify-center space-x-8"
            >
              <Button
                icon={torchOn ? FlashlightOff : Flashlight}
                // variant="outline"
                disabled={Platform.OS === "web"}
                onPress={() => setTorchOn((prev) => !prev)}
              />
              <Button
                icon={X}
                // variant="outline"
                onPress={() => setScannerOpen(false)}
              />
            </Row>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center p-4 bg-black">
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
