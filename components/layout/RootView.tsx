import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { cn } from "~/lib/utils";

interface RootViewProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Disable safe area insets selectively.
   * Example: { top: true, bottom: true } will remove top & bottom padding.
   */
  disableInsets?: Partial<Record<"top" | "bottom" | "left" | "right", boolean>>;
}

const RootView: React.FC<RootViewProps> = ({
  children,
  className,
  disableInsets = {},
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  const paddingStyle = {
    paddingTop: disableInsets.top ? 0 : insets.top,
    paddingBottom: disableInsets.bottom ? 0 : insets.bottom,
    paddingLeft: disableInsets.left ? 0 : insets.left,
    paddingRight: disableInsets.right ? 0 : insets.right,
  };

  return (
    <View
      style={paddingStyle}
      className={cn(
        "flex-1 items-center p-4",
        className
      )}
      {...rest}
    >
      <View className={cn("flex-1 w-full h-full p-4 mx-4")}>
        {children}
      </View>
    </View>
  );
};

export default RootView;
