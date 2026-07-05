// ~/lib/hooks/useBreakpoint.ts
import { useWindowDimensions } from "react-native";
import { Breakpoint, breakpointOrder, breakpoints } from "~/lib/breakpoints";

function getCurrentBreakpoint(width: number): Breakpoint {
  // Walk from largest to smallest, return first one the width satisfies
  for (let i = breakpointOrder.length - 1; i >= 0; i--) {
    const bp = breakpointOrder[i] ?? "md";
    if (width >= breakpoints[bp]) return bp;
  }
  return "xs";
}

export function useBreakpoint() {
  const { width } = useWindowDimensions();
  const current = getCurrentBreakpoint(width);

  const isAbove = (bp: Breakpoint) => width >= breakpoints[bp];
  const isBelow = (bp: Breakpoint) => width < breakpoints[bp];

  return {
    width,
    current, // "xs" | "sm" | "md" | "lg" | "xl"
    isAbove,
    isBelow,
    // convenience flags for the common cases
    isXs: current === "xs",
    isSmallWidth: isBelow("sm"), // replaces your old useIsSmallWidth
  };
}
