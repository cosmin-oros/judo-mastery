import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native"; // Import StatusBar
import * as SplashScreen from "expo-splash-screen";
import { AuthProvider } from "@/src/provider/auth/AuthProvider";
import i18n from "@/src/i18n";
import { ThemeProvider, useTheme } from "@/src/theme/ThemeProvider";
import { lightTheme } from "@/src/theme/themes";
import { LessonsProvider } from "@/src/provider/global/LessonsProvider";

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
        <LessonsProvider>
          <ThemedStatusBar />
          <Stack screenOptions={{ headerShown: false }} />
        </LessonsProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function ThemedStatusBar() {
  const { theme } = useTheme(); // Access the theme

  return (
    <StatusBar
      barStyle={theme === lightTheme ? "light-content" : "dark-content"} // Adapts to theme
      backgroundColor={theme.colors.primary} // Uses theme background color
    />
  );
}
