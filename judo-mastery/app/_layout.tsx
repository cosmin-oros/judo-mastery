import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
// import { AuthProvider } from "@/src/provider/auth/AuthProvider";
// import i18n from "@/src/i18n";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // const [isAppReady, setAppReady] = useState(false);

  // useEffect(() => {
  //   const prepareApp = async () => {
  //     try {
  //       await i18n;
  //     } finally {
  //       setAppReady(true);
  //       await SplashScreen.hideAsync();
  //     }
  //   };
  //   prepareApp();
  // }, []);

  // if (!isAppReady) return null;

  return (
    // <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    // </AuthProvider>
  );
}
