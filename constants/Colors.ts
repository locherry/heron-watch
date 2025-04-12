export const tintColors = [
  {
    name: "framboise",
    light: "#FFB7E7FF",
    dark: '#680647FF'
  },
  {
    name: "ocean",
    light: "#8FD8F0FF",
    dark: '#054053FF'
  },
  {
    name: "sauge",
    light: "#99CE97FF",
    dark: '#2B552BFF'
  },
  {
    name: "rust",
    light: "#E08459FF",
    dark: '#A1421DFF'
  },
  {
    name: "sunny",
    light: "#F1D11CFF",
    dark: '#857206FF'
  },
] as { name: string, light: string, dark: string }[]

const palette = {
  blue: "#0d6efd",
  indigo: "#6610f2",
  purple: "#6f42c1",
  pink: "#d63384",
  red: "#dc3545",
  orange: "#fd7e14",
  yellow: "#ffc107",
  green: "#198754",
  teal: "#20c997",
  cyan: "#0dcaf0",

  darkblue: "#094FB8FF",
  darkindigo: "#4E0ABBFF",
  darkpurple: "#5021A7FF",
  darkpink: "#A7135DFF",
  darkred: "#AF1121FF",
  darkorange: "#AD4E00FF",
  darkyellow: "#9B7400FF",
  darkgreen: "#096B3DFF",
  darkteal: "#0D8662FF",
  darkcyan: "#068FAAFF",

  white: "#ffffff",
  gray100: "#f8f9fa",
  gray200: "#e9ecef",
  gray300: "#dee2e6",
  gray400: "#ced4da",
  gray500: "#adb5bd",
  gray600: "#6c757d",
  gray700: "#495057",
  gray800: "#343a40",
  gray900: "#212529",
  black: "#000000",
}


export const Colors = {
  light: {
    // tint is declared in the useThemeColor hook
    white: palette.white,
    gray100: palette.gray100,
    gray200: palette.gray200,
    gray300: palette.gray300,
    gray400: palette.gray400,
    gray500: palette.gray500,
    gray600: palette.gray600,
    gray700: palette.gray700,
    gray800: palette.gray800,
    gray900: palette.gray900,
    black: palette.gray100,

    background: "#EFEFEF",
    text: "#212121",


    success: palette.green,
    info: palette.cyan,
    warning: palette.yellow,
    danger: palette.red,
    light: palette.gray100,
    dark: palette.gray900
  },
  dark: {
    white: palette.black,
    gray100: palette.gray900,
    gray200: palette.gray800,
    gray300: palette.gray700,
    gray400: palette.gray600,
    gray500: palette.gray500,
    gray600: palette.gray400,
    gray700: palette.gray300,
    gray800: palette.gray200,
    gray900: palette.gray100,
    black: palette.white,

    background: "#161616FF",
    text: "#E0E0E0",

    success: palette.darkgreen,
    info: palette.darkcyan,
    warning: palette.darkyellow,
    danger: palette.darkred,
    light: palette.gray900,
    dark: palette.gray100
  },
};
