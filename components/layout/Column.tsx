import React from "react";
import { View, ViewStyle } from "react-native";

interface RootViewProps {
  children: React.ReactNode;
  gap?: number;
  className?: string; // Optional className prop for customization
}

const Column: React.FC<RootViewProps> = ({ children, gap, className }) => {
  return (
    <View
      style={[
        gap ? { gap: gap } : {},
        // { alignItems: 'flex-start' },
      ]}
      className={`${className}`}
    >
      {children}
    </View>
  );
};

export default Column;
