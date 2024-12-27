import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/src/provider/auth/AuthProvider";
import i18n from "@/src/i18n";
import { ThemeProvider } from "@/src/theme/ThemeProvider";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await i18n; // Wait for i18n to load
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync(); // Ensure this runs after app preparation
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady) return null; // Show nothing until the app is ready

  return (
    <ThemeProvider>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AuthProvider>
    </ThemeProvider>
  );
}
