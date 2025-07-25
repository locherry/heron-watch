import React from "react";
import { View } from "react-native";

interface RootViewProps {
  children: React.ReactNode;
  gap?: number;
  className?: string; // Optional className prop for customization
}

const Column: React.FC<RootViewProps> = ({ children, gap, className }) => {
  return (
    <View
      style={gap ? { gap: gap } : {}}
      className={`flex-1 justify-start items-center ${className}`}
    >
      {children}
    </View>
  );
};

export default Column;
