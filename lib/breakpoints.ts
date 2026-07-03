// To be used in tailwind config and in the usebreakpoint hook

export const breakpoints = {
  xs: 0, // phones
  sm: 480, // large phones / small phones landscape
  md: 768, // tablets portrait
  lg: 1024, // tablets landscape / small desktop
  xl: 1280, // desktop
} as const;

export type Breakpoint = keyof typeof breakpoints;

export const breakpointOrder: Breakpoint[] = ["xs", "sm", "md", "lg", "xl"];
