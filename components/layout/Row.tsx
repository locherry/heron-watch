import React from "react";
import { View } from "react-native";
import { cn } from "~/lib/utils";

interface RootViewProps {
  children: React.ReactNode; // Content to be displayed inside the row
  gap?: number; // Optional spacing (gap) between child elements
  className?: string; // Optional CSS class for styling (e.g. nativewind/tailwind)
}

/**
 * Row component to layout children horizontally with optional gap between them.
 *
 * Note: React Native's View does not support the CSS `gap` property natively.
 * This implementation assumes usage of a styling library (like nativewind) that supports `gap`.
 * Otherwise, a manual margin/padding approach would be necessary for gap.
 *
 * The container has:
 * - flex-1: takes full available space
 * - flex-row: horizontal layout
 * - justify-start: align items to start horizontally
 * - items-center: vertically center children
 *
 * @param children - React nodes to render inside the row
 * @param gap - Optional gap size between children
 * @param className - Additional styling classes
 */
const Row: React.FC<RootViewProps> = ({ children, gap, className }) => {
  return (
    <View
      style={[gap ? { gap: gap } : {}]} // Apply gap if provided
      className={cn(`w-full flex-row justify-start items-center`, className)} // Utility classes for layout and styling
    >
      {children}
    </View>
  );
};

export default Row;
