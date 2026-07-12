import type { BottomSheetModal as BSModalType } from "@gorhom/bottom-sheet";
import BottomSheet, {
  BottomSheetHandle as BSHandle,
  BottomSheetModal as BSModal,
  BottomSheetScrollView as BSScrollView,
  BottomSheetView as BSView,
  BottomSheetBackdrop,
  BottomSheetModalProvider,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { cssInterop, useColorScheme } from "nativewind";
import React, { Fragment, forwardRef } from "react";
import { StyleSheet, View } from "react-native";
import { BSHandleProps, BottomSheetProps, BottomSheetViewProps } from "./types";

const BottomSheetTrigger = Fragment;

const DefaultBackground: React.FC<BottomSheetBackgroundProps> = ({ style }) => (
  <View pointerEvents="none" style={style} className="bg-background" />
);

const DefaultHandle: React.FC<BottomSheetHandleProps> = () => (
  <View className="bg-background items-center justify-center py-3.5 rounded-t-2xl border-t border-border cursor-pointer">
    <View className="w-10 h-1 rounded-full bg-foreground/20" />
  </View>
);

// Dims the app behind the sheet.
const DefaultBackdrop: React.FC<BottomSheetBackdropProps> = (props) => (
  <BottomSheetBackdrop
    {...props}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
    opacity={0.5}
    pressBehavior="close"
  />
);

const shadowStyles = StyleSheet.create({
  light: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dark: {
    elevation: 0,
  },
});

// ----------------------------------------------------------

type BottomSheetModal = BSModalType;

const BottomSheetModal = forwardRef<
  BSModal,
  BottomSheetProps & { children: React.ReactNode; isOpen?: boolean }
>(
  (
    {
      children,
      style,
      backgroundComponent,
      handleComponent,
      backdropComponent,
      ...rest
    }: BottomSheetProps,
    ref,
  ) => {
    const { colorScheme } = useColorScheme();
    const isDark = colorScheme === "dark";

    return (
      <BSModal
        ref={ref}
        style={style ?? (isDark ? shadowStyles.dark : shadowStyles.light)}
        backgroundComponent={backgroundComponent ?? DefaultBackground}
        handleComponent={handleComponent ?? DefaultHandle}
        backdropComponent={backdropComponent ?? DefaultBackdrop}
        {...rest}
      >
        {children}
      </BSModal>
    );
  },
);

const BottomSheetView = cssInterop(BSView, {
  className: "style",
}) as React.ComponentType<BottomSheetViewProps>;

const BottomSheetScrollView = cssInterop(BSScrollView, {
  className: "style",
  contentContainerclassName: "contentContainerStyle",
});

const BottomSheetHandle: React.FC<BSHandleProps> = BSHandle;

export {
  BottomSheet,
  BottomSheetHandle,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetTrigger,
  BottomSheetView
};

