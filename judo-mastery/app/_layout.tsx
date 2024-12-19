import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/src/provider/auth/AuthProvider";
import { ThemeProvider } from "@react-navigation/native";
import { lightTheme, darkTheme } from "@/src/themes/colors";
import i18n from "@/src/i18n";
import { Appearance } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await i18n; // Wait for i18n to load
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === "dark"); // Set initial theme based on system preference

    prepareApp();
  }, []);

  if (!isAppReady) return null;

  return (
    <ThemeProvider value={isDarkMode ? darkTheme : lightTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
