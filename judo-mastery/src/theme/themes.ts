import { colors } from "../theme/colors";

type FontStyle = {
  fontFamily: string;
  fontWeight:
    | "100"
    | "200"
    | "300"
    | "400"
    | "500"
    | "600"
    | "700"
    | "800"
    | "900"
    | "normal"
    | "bold";
};

export const lightTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.white,
    card: colors.white,
    text: colors.black,
    border: colors["slate-300"],
    notification: colors["red-500"],
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" } as FontStyle,
    medium: { fontFamily: "System", fontWeight: "500" } as FontStyle,
    bold: { fontFamily: "System", fontWeight: "700" } as FontStyle,
    heavy: { fontFamily: "System", fontWeight: "900" } as FontStyle,
  },
};

export const darkTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    secondary: colors.secondary,
    background: colors.dark,
    card: colors["slate-900"],
    text: colors.white,
    border: colors["slate-600"],
    notification: colors["red-500"],
  },
  fonts: {
    regular: { fontFamily: "System", fontWeight: "400" } as FontStyle,
    medium: { fontFamily: "System", fontWeight: "500" } as FontStyle,
    bold: { fontFamily: "System", fontWeight: "700" } as FontStyle,
    heavy: { fontFamily: "System", fontWeight: "900" } as FontStyle,
  },
};
