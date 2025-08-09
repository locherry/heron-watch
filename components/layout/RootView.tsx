import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface RootViewProps {
  children: React.ReactNode;  // Content/components to render inside RootView
  className?: string;         // Optional className for styling (e.g. nativewind/tailwind classes)
}

/**
 * RootView component that provides a safe area container and base layout styling.
 * 
 * - Uses SafeAreaView from react-native-safe-area-context to avoid notches, status bars, and other screen insets.
 * - Applies full width and height, flex layout, padding, and center alignment by default.
 * - Accepts additional styling via className.
 * - Wraps children inside a padded View with horizontal margin.
 * - Spreads any extra props to SafeAreaView (e.g. accessibility props).
 *
 * @param children - React nodes to render inside the view
 * @param className - Additional styling classes
 * @param rest - Additional props forwarded to SafeAreaView
 */
const RootView: React.FC<RootViewProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <SafeAreaView
      // Optionally you could enable flex: 1 inline style if needed
      // style={{ flex: 1 }}
      className={`w-full h-full flex-1 justify-start items-center p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 ${className}`}
      {...rest}
    >
      {/* Inner container with full width/height and padding, with horizontal margin */}
      <View className="w-full h-full p-4 mx-4">
        {children}
      </View>
    </SafeAreaView>
  );
};

export default RootView;
