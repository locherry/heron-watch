import React from "react";
import { View } from "react-native";

interface RootViewProps {
  children: React.ReactNode;  // The content to be displayed inside the column
  gap?: number;               // Optional spacing (gap) between children elements
  className?: string;         // Optional CSS class for styling (e.g. using nativewind)
}

/**
 * Column component to layout children vertically with optional gap between them.
 * 
 * Note: React Native's View does not support the CSS `gap` property natively.
 * This code assumes usage of a library or environment that supports gap (e.g. nativewind).
 * Otherwise, manual margin/padding or spacer Views would be needed.
 *
 * @param children - React nodes to render inside the column
 * @param gap - Optional gap size between children
 * @param className - Optional styling className
 */
const Column: React.FC<RootViewProps> = ({ children, gap, className }) => {
  return (
    <View
      style={[
        // Apply gap style if provided
        gap ? { gap: gap } : {},
        // Uncomment below if you want to align children to start horizontally
        // { alignItems: 'flex-start' },
      ]}
      className={`${className}`} // Pass className for styling via CSS-in-JS/nativewind
    >
      {children}
    </View>
  );
};

export default Column;
